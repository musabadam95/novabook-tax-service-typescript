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

router.post<TransactionRequest, Response>('/', (req, res) => {
  console.log(req);
  console.log(res);
});

export default router;
