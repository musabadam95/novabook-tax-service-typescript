import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import { EventType, PatchSaleEvent, SaleEvent, TaxPayment } from '../interfaces/Tax';
const router = express.Router();

let saleEventList: SaleEvent[] = [];
let taxPaymentEventList: TaxPayment[] = [];

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


router.post('/trans', (req, res) => {
  try {
    // if (req.body?.eventType === EventType.SALES) {

    //   const salesEvent = {
    //     date: Date.parse(req.body.date),
    //     invoiceId: req.body.invoiceId,
    //     items: req.body.items,
    //   };
    //   saleEventList.push(salesEvent);
    //   return res.status(202).send();
    // }
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
  calculateTaxPosition();
});


router.get<MessageResponse>('/tax-position', (req, res) => {
  if (!req.query.date) {
    return res.status(400).send();
  }
  const queryDate = req.query.date?.toString();
  const enochDate = Date.parse(queryDate);
  let taxPosition = calculateTaxPositionToDate(enochDate);
  res.json({
    date: req.query.date,
    taxPosition: taxPosition,
  });

});

router.patch<PatchSaleEvent, MessageResponse>('/sale', (req, res) => {
  if (!req.body.date) {
    return res.status(400).send();
  }
  const updatedSaleEvent: PatchSaleEvent = req.body;
  const enochDate = Date.parse(updatedSaleEvent.date);
  let invoiceFound = false;

  saleEventList = saleEventList.map((sale) => {
    if (sale.invoiceId === updatedSaleEvent.invoiceId) {
      invoiceFound = true;
      sale.date = enochDate;
      let itemFound = false;
      sale.items.map((item) => {
        if (item.itemId === req.body.itemId) {
          itemFound = true;
          item.cost = req.body.cost;
          item.taxRate = req.body.taxRate;
        }
      });
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
