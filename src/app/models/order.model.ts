import { Customer } from './customer.model';
import { StockingLocation } from './stocking-location.model';

export interface Order {
  _id: string;
  product: string;
  customer: Customer[];
  updatedAt: Date;
  stockingLocation: StockingLocation[];
  status: string;
  createdBy: string;
  createdAt: Date;
  closedBy: Date;
  canceledBy: string;
  processedBy: string;
  userOwner: string[];
  updatedBy: [{ _id: string; updatedTime: Date; note: string; id: string }];
}
