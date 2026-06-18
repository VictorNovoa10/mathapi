const request = require('supertest');
const express = require('express');
const routes = require('../src/routes');

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Math API', () => {
  it('should add two numbers', async () => {
    const response = await request(app).post('/api/add').send({ a: 5, b: 3 });
    expect(response.body.result).toBe(8);
  });

  it('should subtract two numbers', async () => {
    const response = await request(app).post('/api/subtract').send({ a: 5, b: 3 });
    expect(response.body.result).toBe(2);
  });

  it('should multiply two numbers', async () => {
    const response = await request(app).post('/api/multiply').send({ a: 5, b: 3 });
    expect(response.body.result).toBe(15);
  });

  it('should divide two numbers', async () => {
    const response = await request(app).post('/api/divide').send({ a: 6, b: 3 });
    expect(response.body.result).toBe(2);
  });

  it('should return a divide by zero error', async () => {
    const response = await request(app).post('/api/divide').send({ a: 6, b: 0 });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Cannot divide by zero');
  });

  it('should calculate a power', async () => {
    const response = await request(app).post('/api/pow').send({ a: 2, b: 4 });
    expect(response.body.result).toBe(16);
  });
});
