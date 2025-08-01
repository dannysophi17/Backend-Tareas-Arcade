require('./setup')

const request = require('supertest');
const app = require('../index');
const User = require('../models/User');

describe('Auth',() => {
    it('Registra un nuevo usuario correctamente', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Test User',
                email: 'test@gmail.com',
                password: 'test1234' 
            });
            expect(response.statusCode).toBe(201);
            expect(response.body.token).toBeDefined();
    })
  
})