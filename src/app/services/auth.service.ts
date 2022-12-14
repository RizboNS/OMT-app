import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { TokenObj } from '../models/token-obj.model';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _requestSent$ = new BehaviorSubject(false);
  private _loggedInUserId$ = new BehaviorSubject('');
  private _isLoggedIn$ = new BehaviorSubject(false);
  loggedInUserId$ = this._loggedInUserId$.asObservable();
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  requestSent$ = this._requestSent$.asObservable();
  private tokenObj!: TokenObj;
  constructor(
    private userService: UserService,
    private router: Router,
    private loaderService: LoaderService
  ) {
    const token = localStorage.getItem('auth-token');
    this._isLoggedIn$.next(!!token);
    if (localStorage.getItem('auth-token')) {
      this.tokenObj = jwt_decode(localStorage.getItem('auth-token')!);
      this._loggedInUserId$.next(this.tokenObj._id);
    }
  }

  login(user: {}) {
    this.loaderService.changeLoadingState();
    this._requestSent$.next(true);
    this.userService.login(user).subscribe({
      next: (res: { token: string }) => {
        localStorage.setItem('auth-token', res.token);
        this.tokenObj = jwt_decode(res.token);
        this._isLoggedIn$.next(true);
        this._loggedInUserId$.next(this.tokenObj._id);
        this._requestSent$.next(false);
        this.router.navigate(['profile', this.tokenObj._id]);
        this.loaderService.changeLoadingState();
      },
      error: (err: any) => {
        this._requestSent$.next(false);
        this.loaderService.changeLoadingState();
      },
    });
  }
  getToken() {
    return localStorage.getItem('auth-token');
  }
  logout() {
    localStorage.removeItem('auth-token');
    this._loggedInUserId$.next('');
    this._isLoggedIn$.next(false);
    this.tokenObj = {
      iat: '',
      role: '',
      _id: '',
    };
    this.router.navigate(['login']);
  }
  getUserRole() {
    return this.tokenObj != undefined ? this.tokenObj.role : '';
  }
}
