import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasRoleGuard } from './has-role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { OrderComponent } from './pages/order/order.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [HasRoleGuard],
    data: {
      role: ['USER', 'ADMIN'],
    },
  },
  {
    path: 'orders/:by',
    component: OrdersComponent,
    canActivate: [HasRoleGuard],
    data: {
      role: ['USER', 'ADMIN'],
    },
  },
  {
    path: 'order/:id',
    component: OrderComponent,
    canActivate: [HasRoleGuard],
    data: {
      role: ['USER', 'ADMIN'],
    },
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [HasRoleGuard],
    data: {
      role: ['USER', 'ADMIN'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
