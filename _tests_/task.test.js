require('./setup');
const request = require('supertest');
const app = require('../index');

let token;
let taskId;

beforeEach(async () => {
  // Registrar usuario antes de cada test
  const res = await request(app).post('/api/users/register').send({
    name: 'Cami',
    email: 'cami@test.com',
    password: '123456',
  });
  token = res.body.token;

  // Crear una tarea para los tests que la necesiten
  const taskRes = await request(app)
    .post('/api/tasks')
    .set('x-auth-token', token)
    .send({
      title: 'Tarea de prueba',
      description: 'Contenido inicial',
    });

  taskId = taskRes.body._id;
});

describe('Tareas - End', () => {
  it('✅ Crea una tarea', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('x-auth-token', token)
      .send({
        title: 'Mi segunda tarea',
        description: 'Contenido nuevo',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Mi segunda tarea');
    expect(res.body.completed).toBe(false);
  });

  it('❌ No permite crear tarea sin token', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Sin token',
      description: 'fail',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe('No hay token, permiso denegado');
  });

  it('📄 Obtiene todas las tareas del usuario', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('✏️ Actualiza la tarea', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('x-auth-token', token)
      .send({
        title: 'Tarea actualizada',
        description: 'Nuevo contenido',
        completed: true,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Tarea actualizada');
    expect(res.body.completed).toBe(true);
  });

  it('🗑️ Elimina la tarea (soft delete)', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe('Tarea eliminada (soft delete)');
  });

  it('🔄 Cambia el estado de la tarea', async () => {
    const res = await request(app)
      .patch(`/api/tasks/toggle/${taskId}`)
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(typeof res.body.tarea.completed).toBe('boolean');
  });

  it('❌ No permite actualizar tarea sin token', async () => {
    const res = await request(app).put(`/api/tasks/${taskId}`).send({
      title: 'Intento',
      description: 'Fallido',
    });

    expect(res.statusCode).toBe(401);
  });

  it('❌ No permite eliminar tarea sin token', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(401);
  });
});










