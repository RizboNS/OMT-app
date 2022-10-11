import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.css'],
})
export class OrdersTableComponent implements OnInit, OnChanges {
  @Input() orders$: Observable<Order[]>;
  sortedData: Order[];
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}
  sortData(sort: Sort) {
    const data = this.orders.slice();

    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case '_id':
          return this.compare(a._id, b._id, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        case 'createdAt':
          return this.compare(
            a.createdAt.getTime(),
            b.createdAt.getTime(),
            isAsc
          );
        case 'product':
          return this.compare(a.product, b.product, isAsc);
        case 'updatedAt':
          return this.compare(
            a.updatedAt.getTime(),
            b.updatedAt.getTime(),
            isAsc
          );
        default:
          return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.orders$.subscribe((res) => (this.orders = res));
    this.sortedData = this.orders.slice();
  }
  ngOnInit(): void {
    this.orders$.subscribe((res) => (this.orders = res));
    this.sortedData = this.orders.slice();
  }
}
