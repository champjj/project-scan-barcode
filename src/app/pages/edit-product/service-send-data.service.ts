import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceSendDataService {
  private productItem = new BehaviorSubject<any>('');

  productItem$ = this.productItem.asObservable();

  constructor() {}

  setProductItem(item: any) {
    this.productItem.next(item);
  }
}
