require('./setup');

const request = require('supertest');
const app = require('../index');
const User = require('../models/User');

describe('Auth - Registro', () => {
    it('✅ Registra un nuevo usuario correctamente', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Test User',
                email: 'test@gmail.com',
                password: 'test1234'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.token).toBeDefined();
    });

    it('✖️ No permite registrar con correo repetido', async () => {
        await request(app).post('/api/users/register').send({
            name: 'Test User',
            email: 'test@gmail.com',
            password: 'test1234'
        });

        const res = await request(app).post('/api/users/register').send({
            name: 'Another User',
            email: 'test@gmail.com',
            password: 'test1234'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe('El usuario ya existe');
    });

    it('✖️ No permite registrar si faltan campos', async () => {
    const res = await request(app).post('/api/users/register').send({
        name: 'Sin correo',
        password: 'clave1234'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('Faltan datos');
    });

    it('✖️ No permite registrar si los campos están vacíos', async () => {
    const res = await request(app).post('/api/users/register').send({
        name: '',
        email: '',
        password: ''
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('Faltan datos');
    });
});

describe('Auth - Login', () => {
    const userData = {
        name: 'Test User',
        email: 'test@gmail.com',
        password: 'test1234'
    };

    it('✅ Hace login correctamente', async () => {
        await request(app).post('/api/users/register').send(userData);

        const res = await request(app).post('/api/users/login').send({
            email: userData.email,
            password: userData.password
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe(userData.email);
    });

    it('✖️ No permite login con contraseña incorrecta', async () => {
        await request(app).post('/api/users/register').send(userData);

        const res = await request(app).post('/api/users/login').send({
            email: userData.email,
            password: 'claveIncorrecta'
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe('Contraseña incorrecta');
    });

    it('✖️ No permite login si el usuario no existe', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'noexiste@test.com',
            password: 'cualquierclave'
        });

        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe('Usuario no encontrado');
    });

    it('✖️ Falla si no se envía ningún dato', async () => {
        const res = await request(app).post('/api/users/login').send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe('Faltan datos');
    });
});


