require('./setup');
const request = require('supertest');
const app = require('../index');

let token;

beforeEach(async () => {
  const res = await request(app).post('/api/users/register').send({
    name: 'Cami',
    email: 'cami2@test.com',
    password: '123456'
  });
  token = res.body.token;

  // Crear tareas
  await request(app).post('/api/tasks').set('x-auth-token', token).send({
    title: 'Tarea completada',
    description: 'desc',
    completed: true
  });
  await request(app).post('/api/tasks').set('x-auth-token', token).send({
    title: 'Tarea pendiente',
    description: 'desc',
    completed: false
  });
});

describe('Task Stats - End', () => {
  it('📊 Retorna total por estado', async () => {
    const res = await request(app)
      .get('/api/tasks/stats')
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBeDefined();
    expect(res.body.pending).toBeDefined();
  });

  it('❌ No permite ver estadísticas sin token', async () => {
    const res = await request(app).get('/api/tasks/stats');
    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe('No hay token, permiso denegado');
  });
});

