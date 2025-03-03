import request from 'supertest';
import express from 'express';
import router from './index';

const app = express();
app.use(express.json());
app.use('/tax', router);

describe('Tax Service API', () => {
  const path = '/tax/';
//   it('should add a sales event and return 202 status', async () => {
//     const response = await request(app)
//       .post('/tax/trans')
//       .send({
//         eventType: 'SALES',
//         date: '2023-02-22T17:29:39Z',
//         invoiceId: '3419027d-960f-4e8f-b8b7-f7b2b4791834',
//         items: [
//           { itemId: '02db47b6-fe68-4005-a827-24c6e962f3dc', cost: 100, taxRate: 0.1 },
//         ],
//       });
//     expect(response.status).toBe(202);
//   });

//   it('should add a tax payment event and return 202 status', async () => {
//     const response = await request(app)
//       .post('/tax/trans')
//       .send({
//         eventType: 'TAX_PAYMENT',
//         date: '2023-02-22T17:29:39Z',
//         amount: 5,
//       });
//     expect(response.status).toBe(202);
//   });

  it('should return tax position for a given date', async () => {
    await request(app)
      .post('/tax/trans')
      .send({
        eventType: 'SALES',
        date: '2023-02-21T17:29:39Z',
        invoiceId: '3419027d-960f-4e8f-b8b7-f7b2b4791834',
        items: [
          { itemId: '02db47b6-fe68-4005-a827-24c6e962f3dc', cost: 200, taxRate: 0.2 },
        ],
      });

    await request(app)
      .post(path + 'trans')
      .send({
        eventType: 'TAX_PAYMENT',
        date: '2023-02-2T17:29:39Z',
        amount: 10,
      });

    const response = await request(app)
      .get(path + 'tax-position')
      .query({ date: '2023-10-01' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('taxPosition');
    expect(response.body.taxPosition).toBe(20);
  });

//   it('should update a sales event and return 202 status', async () => {
//     await request(app)
//       .post(path + 'trans')
//       .send({
//         eventType: 'SALES',
//         date: '2023-10-01',
//         invoiceId: 'INV003',
//         items: [
//           { itemId: 'ITEM003', cost: 300, taxRate: 0.3 },
//         ],
//       });

//     const response = await request(app)
//       .patch(path + '/sale')
//       .send({
//         date: '2023-10-02',
//         invoiceId: 'INV003',
//         itemId: 'ITEM003',
//         cost: 350,
//         taxRate: 0.35,
//       });

//     expect(response.status).toBe(202);
//   });
});