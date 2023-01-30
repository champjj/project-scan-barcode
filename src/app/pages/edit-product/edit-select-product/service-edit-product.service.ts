import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceEditProductService {
  private productCode = new BehaviorSubject<string>('');
  productCode$ = this.productCode.asObservable();
  constructor() {}

  setProductCode(code: string) {
    this.productCode.next(code);
  }
}
