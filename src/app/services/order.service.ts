import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _pendingOrders$ = new BehaviorSubject([]);
  pendingOrders$ = this._pendingOrders$.asObservable();

  private _url_find_by_field_dev =
    'http://localhost:5001/order-management-tool-api/us-central1/app/orders/by-field';
  constructor(private http: HttpClient) {}

  findByField(field) {
    return this.http.post<Order[]>(this._url_find_by_field_dev, field);
  }

  initPendingOrders() {
    this.findByField({ status: 'pending' }).subscribe({
      next: (res) => {
        this._pendingOrders$.next(res);
      },
      error: () => {},
    });
  }
}
