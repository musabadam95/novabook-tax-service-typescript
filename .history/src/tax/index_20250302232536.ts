import express from 'express';
import { UUID } from 'crypto';

import MessageResponse from '../interfaces/MessageResponse';
const router = express.Router();

enum EventType {
  SALES = 'SALES',
  TAX_PAYMENT = 'TAX_PAYMENT',
}

type Item = {
  itemId: UUID;
  cost: number;
  taxRate: number;
};
type TransactionRequest = {
  eventType: EventType;
  date: string;
  invoiceId?: UUID;
  items?: [Item];
  amount?: number;
};

type SaleEvent = {
  date: number;
  invoiceId: UUID;
  items: [Item];
};

// type TransactionResponse = Response & {
//   message: string;
// };

let saleEventList: SaleEvent[] = [];
let taxPaymentEventList = [];



router.post('/trans', (req, res) => {
  console.log(req.body, 'req');
  try {
    if (req.body?.eventType === EventType.SALES) {

      const salesEvent = {
        date: Date.parse(req.body.date),
        invoiceId: req.body.invoiceId,
        items: req.body.items,
      };
      console.log(salesEvent, 'salesEvent');
      saleEventList.push(salesEvent);
      return res.status(202).send();
    }
    if (req.body?.eventType === EventType.TAX_PAYMENT) {
      const taxPaymentEvent = {
        date: Date.parse(req.body.date),
        amount: req.body.amount,
      };
      taxPaymentEventList.push(taxPaymentEvent);
      res.status(202);
    }
  } catch (err) {
    console.log(err);
    return res.status(400);
  }

});


router.get<MessageResponse>('/tax-position', (req, res) => {
  if (!req.query.date) {
    return res.status(400).send();
  }
  const queryDate = req.query.date?.toString();

  const enochDate = Date.parse(queryDate);
  console.log(enochDate, 'enochDateGET');
  let totalSales = 0;
  let totalTax = 0;
  let totalTaxPayment = 0;
  let taxPosition = 0;

  saleEventList.forEach((saleEvent) => {
    console.log(saleEvent);
    if (saleEvent.date <= enochDate) {
      saleEvent.items.forEach((item) => {
        totalSales += item.cost;
        totalTax += item.cost * item.taxRate;
      });
    }
  });
  res.json({
    message: totalSales,
  });

});

router.patch<{ date: string }, MessageResponse>('/sale', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });

});

export default router;
