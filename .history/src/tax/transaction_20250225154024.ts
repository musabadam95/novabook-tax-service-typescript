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


// type TransactionResponse = Response & {
//   message: string;
// };

let saleEventList = [];
let taxPaymentEventList = [];



router.post<TransactionRequest, {}>('/', (req, res) => {
  if (req.body.eventType === EventType.SALES) {
    const salesEvent = {
      date: new Date(req.body.date).getTime(),
      invoiceId: req.body.invoiceId,
      items: req.body.items,
      amount: req.body.amount,
    };
    saleEventList.push(salesEvent);
    res.status(202);
  }
  if (req.body.eventType === EventType.TAX_PAYMENT) {
    const taxPaymentEvent = {
      date: new Date(req.body.date).getTime(),
      amount: req.body.amount,
    };
    taxPaymentEventList.push(taxPaymentEvent);
    res.status(202);
  }
});


router.get<{ date: string }, MessageResponse>('/tax-position', (req, res) => {

  res.json({
    message: 'API - 👋🌎🌍🌏',
  });

},

router.patch<{ date: string }, MessageResponse>('/sale', (req, res) => {

  res.json({
    message: 'API - 👋🌎🌍🌏',
  });

}),
);

export default router;
