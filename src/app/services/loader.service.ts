import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public isLoading = false;
  constructor() {}

  changeLoadingState() {
    this.isLoading ? (this.isLoading = false) : (this.isLoading = true);
  }
}
