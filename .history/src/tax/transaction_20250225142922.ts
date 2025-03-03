import { UUID } from 'crypto';
import express from 'express';

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

type TransactionResponse = {
  message: string;
  status: string;
};
let saleEventList = [];
let taxPaymentEventList = [];



router.post<TransactionRequest, TransactionResponse>('/', (req, res) => {
  console.log(req);
  console.log(res);
  if(req.body.eventType === EventType.SALES) {
    saleEventList.push(req.body);
    res.json({
      message: 'Sales event added',
      status: 'success',
    });
  }
  if(req.body.eventType === EventType.TAX_PAYMENT) {
    taxPaymentEventList.push(req.body);
    res.json({
      message: 'Tax payment event added',
      status: 'success',
    });
  }

});

export default router;
