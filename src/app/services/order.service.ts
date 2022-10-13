import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Order } from '../models/order.model';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _pendingOrders$ = new BehaviorSubject([]);
  pendingOrders$ = this._pendingOrders$.asObservable();

  private _allOpenOrders$ = new BehaviorSubject([]);
  allOpenOrders$ = this._allOpenOrders$.asObservable();

  private _agentOpenOrders$ = new BehaviorSubject([]);
  agentOpenOrders$ = this._agentOpenOrders$.asObservable();

  private _allLoaded$ = new BehaviorSubject([true, true, true]);
  allLoaded$ = this._allLoaded$.asObservable();

  private _url_find_by_field_dev =
    'http://localhost:5001/order-management-tool-api/us-central1/app/orders/by-field';
  constructor(private http: HttpClient, private loaderService: LoaderService) {}

  findByField(field) {
    return this.http.post<Order[]>(this._url_find_by_field_dev, field);
  }

  initOrders() {
    this._allLoaded$.next([false, false, false]);
    this.loaderService.isLoading = true;
    this.initPendingOrders();
    this.initAllOpenOrders();
    this.initOpenOrdersFromAgent();
    this.allLoaded$.subscribe((res) => {
      let trueCount = 0;
      res.forEach((el) => {
        if (el === true) {
          trueCount++;
        }
      });
      if (trueCount === 3) {
        this.loaderService.isLoading = false;
      }
    });
  }

  initPendingOrders() {
    this.findByField({ status: 'pending' }).subscribe({
      next: (res) => {
        this._pendingOrders$.next(res);
        this._allLoaded$.next(
          this._allLoaded$.value.map((el, i) =>
            i == 0 ? (el = true) : (el = el)
          )
        );
      },
      error: () => {
        this._allLoaded$.next(
          this._allLoaded$.value.map((el, i) =>
            i == 0 ? (el = true) : (el = el)
          )
        );
      },
    });
  }
  initAllOpenOrders() {
    this.findByField({ status: 'open' }).subscribe({
      next: (res) => {
        this._allOpenOrders$.next(res);
        this._allLoaded$.next(
          this._allLoaded$.value.map((el, i) =>
            i == 1 ? (el = true) : (el = el)
          )
        );
      },
      error: () => {
        this._allLoaded$.next(
          this._allLoaded$.value.map((el, i) =>
            i == 1 ? (el = true) : (el = el)
          )
        );
      },
    });
  }
  initOpenOrdersFromAgent() {
    this.findByField({
      status: 'open',
      userOwner: '633821e935df8b21513b2e9d',
    }).subscribe({
      next: (res) => {
        this._agentOpenOrders$.next(res);
        this._allLoaded$.next(
          this._allLoaded$.value.map((el, i) =>
            i == 2 ? (el = true) : (el = el)
          )
        );
      },
      error: () => {
        this._allLoaded$.next(
          this._allLoaded$.value.map((el, i) =>
            i == 2 ? (el = true) : (el = el)
          )
        );
      },
    });
  }
}
