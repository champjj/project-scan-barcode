import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { IProduct } from 'src/app/@core/models/products-models';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  productList = new BehaviorSubject<IProduct[] | undefined>(undefined);
  productList$ = this.productList.asObservable();

  constructor(private route: Router, private apiService: ApiServiceService) {}

  ngOnInit(): void {
    this.initDataProducts();
  }

  initDataProducts() {
    this.apiService
      .getProducts()
      .pipe(tap((productList: any) => this.productList.next(productList)))
      .subscribe((productList) => console.log({ productList }));
  }

  onSelectProduct(item: IProduct): void {
    this.route.navigate(['edit-select', item.productCode]);
  }
}
