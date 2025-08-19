require('./setup');
const request = require('supertest');
const app = require('../index');

let token;
let taskId;

beforeEach(async () => {
  // Registrar usuario
  const res = await request(app).post('/api/users/register').send({
    name: 'Cami',
    email: 'cami@test.com',
    password: '123456'
  });
  token = res.body.token;

  // Crear tarea base
  const taskRes = await request(app)
    .post('/api/tasks')
    .set('x-auth-token', token)
    .send({
      title: 'Tarea de prueba',
      description: 'Tarea con historial'
    });
  taskId = taskRes.body._id;
});

describe('Task History - End', () => {
  it('✅ Crea un historial para una tarea', async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/history`)
      .set('x-auth-token', token)
      .send({
        action: 'edit',  
        dataBefore: { completed: false },
        dataAfter: { completed: true }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.action).toBe('edit');
  });

  it('📄 Obtiene historial de una tarea', async () => {
    await request(app)
      .post(`/api/tasks/${taskId}/history`)
      .set('x-auth-token', token)
      .send({
        action: 'edit',
        dataBefore: { completed: false },
        dataAfter: { completed: true }
      });

    const res = await request(app)
      .get(`/api/tasks/${taskId}/history`)
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('❌ No permite ver historial sin token', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}/history`);
    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe('No hay token, permiso denegado'); 
  });
});



