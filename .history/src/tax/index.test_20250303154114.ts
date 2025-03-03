import request from 'supertest';
import express from 'express';
import router from './index';

const app = express();
app.use(express.json());
app.use('/tax', router);

describe('Tax Service API', () => {
  const path = '/tax/v1/';
  it('should add a sales event and return 202 status', async () => {
    const response = await request(app)
      .post('tax/v1/trans')
      .send({
        eventType: 'SALES',
        date: '2023-10-01',
        invoiceId: 'INV001',
        items: [
          { itemId: 'ITEM001', cost: 100, taxRate: 0.1 },
        ],
      });
    expect(response.status).toBe(202);
  });

//   it('should add a tax payment event and return 202 status', async () => {
//     const response = await request(app)
//       .post(path + 'trans')
//       .send({
//         eventType: 'TAX_PAYMENT',
//         date: '2023-10-01',
//         amount: 50,
//       });
//     expect(response.status).toBe(202);
//   });

//   it('should return tax position for a given date', async () => {
//     await request(app)
//       .post(path + 'trans')
//       .send({
//         eventType: 'SALES',
//         date: '2023-10-01',
//         invoiceId: 'INV002',
//         items: [
//           { itemId: 'ITEM002', cost: 200, taxRate: 0.2 },
//         ],
//       });

//     await request(app)
//       .post(path + 'trans')
//       .send({
//         eventType: 'TAX_PAYMENT',
//         date: '2023-10-01',
//         amount: 100,
//       });

//     const response = await request(app)
//       .get(path + 'tax-position')
//       .query({ date: '2023-10-01' });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('taxPosition');
//   });

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