import express from 'express';

const router = express.Router();
type Item = {
  itemId: string;
  cost: number;
  taxRate: number;
};
type TransactionRequest = {
  eventType: string;
  date: string;
  invoiceId?: string;
  items?: [Item];
  amount?: number;
};

router.post<TransactionRequest, Response>('/', (req, res) => {
  console.log(req);
  console.log(res);
});

export default router;
