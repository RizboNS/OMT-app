import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoaderService } from './services/loader.service';

import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
  RouterOutlet,
} from '@angular/router';
import { OrderService } from './services/order.service';
import { Order } from './models/order.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showFiller = false;
  title = 'Order Management Tool';
  pendingOrders: Order[] = [];
  allOpenOrders: Order[] = [];
  agentOpenOrders: Order[] = [];

  private _allLoaded$ = new BehaviorSubject([true, true, true]);
  allLoaded$ = this._allLoaded$.asObservable();

  constructor(
    public authService: AuthService,
    public loaderService: LoaderService,
    private router: Router,
    private orderService: OrderService
  ) {
    router.events.subscribe((routerEvent: RouterEvent) => {
      this.checkRouteChange(routerEvent);
    });
  }
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((res) => {
      if (res) {
        this.initOrders();
      }
    });
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
    this.orderService.findByField({ status: 'pending' }).subscribe({
      next: (res) => {
        this.pendingOrders = res;
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
    this.orderService.findByField({ status: 'open' }).subscribe({
      next: (res) => {
        this.allOpenOrders = res;
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
    this.orderService
      .findByField({ status: 'open', userOwner: '633821e935df8b21513b2e9d' })
      .subscribe({
        next: (res) => {
          this.agentOpenOrders = res;
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

  checkRouteChange(routerEvent: RouterEvent) {
    if (routerEvent instanceof NavigationStart) {
      this.loaderService.isLoading = true;
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.loaderService.isLoading = false;
    }
  }
}
