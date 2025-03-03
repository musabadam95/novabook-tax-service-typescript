import request from 'supertest';
import express from 'express';
import router from './index';

const app = express();
app.use(express.json());
app.use('/tax', router);

beforeEach(() => {
    // Reset any variables or state before each test
    
});

afterEach(() => {
    // Clean up any state after each test
});
describe('Adding events', () => {

  const path = '/tax/';
  it('should add a sales event and return 202 status', async () => {
    const response = await request(app)
      .post(path + 'transactions')
      .send({
        eventType: 'SALES',
        date: '2023-02-22T17:29:39Z',
        invoiceId: '3419027d-960f-4e8f-b8b7-f7b2b4791834',
        items: [
          { itemId: '02db47b6-fe68-4005-a827-24c6e962f3dc', cost: 100, taxRate: 0.1 },
        ],
      });
    expect(response.status).toBe(202);
  });

  it('should add a tax payment event and return 202 status', async () => {
    const response = await request(app)
      .post(path + 'transactions')
      .send({
        eventType: 'TAX_PAYMENT',
        date: '2023-02-22T17:29:39Z',
        amount: 5,
      });
    expect(response.status).toBe(202);
  });

  it('should return tax position for a given date', async () => {
    await request(app)
      .post(path + 'transactions')
      .send({
        eventType: 'SALES',
        date: '2023-02-21T17:29:39Z',
        invoiceId: '3419027d-960f-4e8f-b8b7-f7b2b4791834',
        items: [
          { itemId: '02db47b6-fe68-4005-a827-24c6e962f3dc', cost: 200, taxRate: 0.2 },
        ],
      });

    await request(app)
      .post(path + 'transactions')
      .send({
        eventType: 'TAX_PAYMENT',
        date: '2023-02-21T17:29:39Z',
        amount: 20,
      });

    const response = await request(app)
      .get(path + 'tax-position')
      .query({ date: '2023-02-20T17:29:39Z' });

    expect(response.status).toBe(200);
    expect(response.body.taxPosition).toBe(20);
  });

  it('should return invalid date when sending a SALES event with invalid date', async () => {
    let response = await request(app)
      .post(path + 'transactions')
      .send({
        eventType: 'SALES',
        date: '2as',
        invoiceId: '3419027d-960f-4e8f-b8b7-f7b2b4791834',
        items: [
          { itemId: '02db47b6-fe68-4005-a827-24c6e962f3dc', cost: 200, taxRate: 0.2 },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid date format');

  });

  it('should return invalid date when sending a TAX_PAYMENT event with invalid date', async () => {
    await request(app)
      .post(path + 'transactions')
      .send({
        eventType: 'TAX_PAYMENT',
        date: '2as',
        amount: 20,
      });

    const response = await request(app)
      .get(path + 'tax-position')
      .query({ date: '2as' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid date format');

  });

  it('should return invalid date when requesting tax position with invalid date', async () => {
    const response = await request(app)
      .get(path + 'tax-position')
      .query({ date: '2as' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid date format');

  });


  it('should return invalid input on empty body', async () => {
    const response = await request(app)
      .post(path + 'transactions')
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid date format');

  });

});

describe('Update Events', () => {

  const path = '/tax/';
  it('should update a sales event and return 202 status', async () => {
    await request(app)
      .post(path + 'transactions')
      .send({
        eventType: 'SALES',
        date: '2023-02-21T17:29:39Z',
        invoiceId: '3419027d-960f-4e8f-b8b7-f7b2b4791834',
        items: [
          { itemId: '02db47b6-fe68-4005-a827-24c6e962f3dc', cost: 300, taxRate: 0.2 },
        ],
      });

    await request(app)
      .patch(path + 'sale')
      .send({
        date: '2023-02-21T17:29:39Z',
        invoiceId: '3419027d-960f-4e8f-b8b7-f7b2b4791834',
        itemId: '02db47b6-fe68-4005-a827-24c6e962f3dc',
        cost: 350,
        taxRate: 0.3,
      });

    const response = await request(app)
      .get(path + 'tax-position')
      .query({ date: '2023-02-20T17:29:39Z' });

    expect(response.status).toBe(200);
    expect(response.body.taxPosition).toBe(105);
  });
});