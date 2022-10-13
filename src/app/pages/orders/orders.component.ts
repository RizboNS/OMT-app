import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterEvent } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription, take } from 'rxjs';
import { Sort } from '@angular/material/sort';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  public destroyed = new Subject<any>();

  sortedData: Order[];
  orders: Order[] = [];

  sub1: Subscription;
  pendSub: Subscription;
  allOpenSub: Subscription;
  agentOpenSub: Subscription;
  sub5: Subscription;

  param = '';
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.unSub(this.pendSub);
        this.unSub(this.allOpenSub);
        this.unSub(this.agentOpenSub);
        this.loadOrders();
      }
    });
  }
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
  ngOnInit(): void {
    this.loadOrders();
  }
  ngOnDestroy(): void {
    this.unSub(this.sub1);
    this.unSub(this.pendSub);
    this.unSub(this.allOpenSub);
    this.unSub(this.agentOpenSub);
    this.unSub(this.sub5);
  }

  unSub(sub: Subscription) {
    if (sub != undefined) {
      sub.unsubscribe();
    }
  }

  loadPendingOrders() {
    this.pendSub = this.orderService.pendingOrders$.subscribe((res) => {
      this.orders = res;
      this.sortedData = this.orders.slice();
    });
  }
  loadAllOpenOrders() {
    this.allOpenSub = this.orderService.allOpenOrders$.subscribe((res) => {
      this.orders = res;
      this.sortedData = this.orders.slice();
    });
  }
  loadAgentOpenOrders() {
    this.agentOpenSub = this.orderService.agentOpenOrders$.subscribe((res) => {
      this.orders = res;
      this.sortedData = this.orders.slice();
    });
  }
  getParams() {
    this.sub5 = this.route.params.subscribe((params) => {
      this.param = params['by'];
    });
  }

  loadOrders() {
    this.getParams();
    if (this.param === 'pending') {
      this.loadPendingOrders();
      this.param = '';
    } else if (this.param === 'all-open') {
      this.param = '';
      this.loadAllOpenOrders();
    } else if (this.param === 'agent-open') {
      this.loadAgentOpenOrders();
      this.param = '';
    }
  }
}
