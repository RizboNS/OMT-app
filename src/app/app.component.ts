import { Component } from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showFiller = false;
  title = 'Order Management Tool';
  constructor(
    public authService: AuthService,
    public loaderService: LoaderService,
    private router: Router
  ) {
    router.events.subscribe((routerEvent: RouterEvent) => {
      this.checkRouteChange(routerEvent);
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
