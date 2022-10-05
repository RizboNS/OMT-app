import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _urlDev_login =
    'http://localhost:5001/order-management-tool-api/us-central1/app/users/login';
  private _urlDev_getUser =
    'http://localhost:5001/order-management-tool-api/us-central1/app/users/';
  constructor(private http: HttpClient) {}

  login(user: {}): Observable<any> {
    return this.http.post<any>(this._urlDev_login, user);
  }
  getUser(id: string): Observable<User> {
    return this.http.get<User>(this._urlDev_getUser + id);
  }
}
