import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceEditProductService {
  private productInStockEditPage = new BehaviorSubject<[]>([]);
  productInStockEditPage$ = this.productInStockEditPage.asObservable();
  constructor(private apiService: ApiServiceService) {}

  setProductCode(code: []) {
    this.productInStockEditPage.next(code);
  }
}
