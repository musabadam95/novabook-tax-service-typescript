import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import { EventType, PatchSaleEvent, SaleEvent, TaxPayment } from '../interfaces/Tax';
const router = express.Router();

let saleEventList: SaleEvent[] = [];
let taxPaymentEventList: TaxPayment[] = [];

export function resetTax() {
  saleEventList = [];
  taxPaymentEventList = [];
}

function calculateTaxPosition() {
  let totalTax = 0;
  let totalTaxPayment = 0;

  saleEventList.forEach((saleEvent) => {
    saleEvent.items.forEach((item) => {
      totalTax += item.cost * item.taxRate;
    });
  });

  taxPaymentEventList.forEach((taxPaymentEvent) => {
    totalTaxPayment += taxPaymentEvent.amount;
  });

  let taxPosition = totalTax - totalTaxPayment;
  return taxPosition;
}

function calculateTaxPositionToDate(taxDate: number) {
  let totalTax = 0;
  let totalTaxPayment = 0;

  saleEventList.forEach((saleEvent) => {
    if (saleEvent.date >= taxDate) {
      saleEvent.items.forEach((item) => {
        totalTax += item.cost * item.taxRate;
      });
    }
  });

  taxPaymentEventList.forEach((taxPaymentEvent) => {
    if (taxPaymentEvent.date >= taxDate) {
      totalTaxPayment += taxPaymentEvent.amount;
    }
  });
  let taxPosition = totalTax - totalTaxPayment;
  return taxPosition;
}

router.post('/transactions', (req, res) => {
  try {
    if (!req.body === null) {
      return res.status(400).send({ message: 'Invalid input' });
    }

    const enochDate = Date.parse(req.body.date);
    if (isNaN(enochDate)) {
      return res.status(400).send({ message: 'Invalid date format' });
    }

    if (req.body?.eventType === EventType.SALES) {
      if (!req.body || typeof req.body !== 'object' || !('invoiceId' in req.body) || !('date' in req.body) || !('items' in req.body)) {
        return res.status(400).send({ message: 'Invalid input' });
      }
      const salesEvent = {
        date: enochDate,
        invoiceId: req.body.invoiceId,
        items: req.body.items,
      };
      saleEventList.push(salesEvent);
      return res.status(202).send();
    }
    if (req.body?.eventType === EventType.TAX_PAYMENT) {
      if (!req.body || typeof req.body !== 'object' || !('date' in req.body) || !('amount' in req.body)) {
        return res.status(400).send({ message: 'Invalid input' });
      }
      const taxPaymentEvent = {
        date: enochDate,
        amount: req.body.amount,
      };
      taxPaymentEventList.push(taxPaymentEvent);
      res.status(202).send();
    } else {
      return res.status(400).send({ message: 'Invalid input' });
    }
  } catch (err) {
    console.log(err);
    return res.status(400);
  }
  calculateTaxPosition();
});

router.get<MessageResponse>('/tax-position', (req, res) => {
  if (!req.query.date) {
    return res.status(400).send({ message: 'Invalid input' });
  }
  const queryDate = req.query.date.toString();
  const enochDate = Date.parse(queryDate);
  console.log(enochDate);

  if (isNaN(enochDate)) {
    return res.status(400).send({ message: 'Invalid date format' });
  }

  let taxPosition = calculateTaxPositionToDate(enochDate);
  res.json({
    date: req.query.date,
    taxPosition: taxPosition,
  });

});

router.patch<PatchSaleEvent, MessageResponse>('/sale', (req, res) => {

  if (!req.body || typeof req.body !== 'object' || !('invoiceId' in req.body) || !('date' in req.body) || !('itemId' in req.body) || !('cost' in req.body) || !('taxRate' in req.body)) {
    return res.status(400).send({ message: 'Invalid input' });
  }

  const updatedSaleEvent: PatchSaleEvent = req.body;
  const enochDate = Date.parse(updatedSaleEvent.date);
  if (isNaN(enochDate)) {
    return res.status(400).send({ message: 'Invalid date format' });
  }
  let invoiceFound = false;

  saleEventList = saleEventList.map((sale) => {
    if (sale.invoiceId === updatedSaleEvent.invoiceId) {
      invoiceFound = true;
      sale.date = enochDate;
      let itemFound = false;
      let updatedSaleItem = sale.items.map((item) => {
        if (item.itemId === req.body.itemId) {
          itemFound = true;
          item.cost = req.body.cost;
          item.taxRate = req.body.taxRate;
        }
        return item;
      });
      sale.items = updatedSaleItem;
      if (!itemFound) {
        sale.items.push({
          itemId: updatedSaleEvent.itemId,
          cost: updatedSaleEvent.cost,
          taxRate: updatedSaleEvent.taxRate,
        });
      }
    }
    return sale;
  });

  if (!invoiceFound) {
    const salesEvent: SaleEvent = {
      date: enochDate,
      invoiceId: updatedSaleEvent.invoiceId,
      items: [{
        itemId: updatedSaleEvent.itemId,
        cost: updatedSaleEvent.cost,
        taxRate: updatedSaleEvent.taxRate,
      }],
    };
    saleEventList.push(salesEvent);

  }
  calculateTaxPosition();
  return res.status(202).send();
});

export default router;
