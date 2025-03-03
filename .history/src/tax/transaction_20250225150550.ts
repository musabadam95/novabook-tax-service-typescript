import { UUID } from 'crypto';
import express from 'express';
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

type TransactionResponse = Response & {
  message: string;
};
let saleEventList = [];
let taxPaymentEventList = [];



router.post<TransactionRequest, {}>('/', (req, res) => {
  console.log(req);
  console.log(res);
  if (req.body.eventType === EventType.SALES) {
    saleEventList.push(req.body);
    res.status(201).json({
      message: 'Sales event added',
    },
    );
    
  }
  if (req.body.eventType === EventType.TAX_PAYMENT) {
    taxPaymentEventList.push(req.body);
    res.json({
      message: 'Tax payment event added',
    });
  }

});

export default router;
