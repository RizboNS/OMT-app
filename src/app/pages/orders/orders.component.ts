import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterEvent } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  public destroyed = new Subject<any>();

  private _orders$ = new BehaviorSubject([]);
  orders$ = this._orders$.asObservable();

  param = '';
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.loadOrders();
      }
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }
  loadPendingOrders() {
    this.orderService.pendingOrders$
      .subscribe((res) => {
        this._orders$.next(res);
      })
      .unsubscribe();
  }
  loadAllOpenOrders() {
    this.orderService.allOpenOrders$
      .subscribe((res) => {
        this._orders$.next(res);
      })
      .unsubscribe();
  }
  loadAgentOpenOrders() {
    this.orderService.agentOpenOrders$
      .subscribe((res) => {
        this._orders$.next(res);
      })
      .unsubscribe();
  }
  getParams() {
    this.route.params.subscribe((params) => {
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
