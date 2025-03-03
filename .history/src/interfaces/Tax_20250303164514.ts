import { UUID } from 'crypto';

export enum EventType {
  SALES = 'SALES',
  TAX_PAYMENT = 'TAX_PAYMENT',
}

export type Item = {
  itemId: UUID;
  cost: number;
  taxRate: number;
};
export type TransactionRequest = {
  eventType: EventType;
  date: string;
  invoiceId?: UUID;
  items?: [Item];
  amount?: number;
};

export type TaxPayment = {
  date: number;
  amount: number;
};

export type SaleEvent = {
  date: number;
  invoiceId: UUID;
  items: Item[];
};

export type PatchSaleEvent = {
  date: string;
  invoiceId: UUID;

} & Item;