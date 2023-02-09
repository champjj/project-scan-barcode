import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { IProduct } from 'src/app/@core/models/products-models';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';
import { ServiceEditProductService } from './service-edit-product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  productList = new BehaviorSubject<IProduct[] | undefined>(undefined);
  productList$ = this.productList.asObservable();

  constructor(
    private route: Router,
    private apiService: ApiServiceService,
    private serviceEditProduct: ServiceEditProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initDataProducts();
  }

  initDataProducts() {
    this.apiService
      .getProducts()
      .pipe(
        tap((productList: any) => {
          this.serviceEditProduct.setProductCode(productList);
          this.productList.next(productList);
        })
      )
      .subscribe((productList) => {
        console.log({ productList });
      });
  }

  onSelectProduct(item: IProduct): void {
    this.route.navigate(['edit-select', item.productCode]);
  }

  onDeleteProduct(product: any) {
    this.dialog
      .open(DialogStatusEditPage, { data: product })
      .afterClosed()
      .subscribe((condition) => {
        console.log(condition);

        if (condition.data == 'confirm') {
          console.log(product);
          this.apiService.deleteProduct(product.id);
          this.initDataProducts();
        }
      });
  }

  onBack() {
    this.route.navigate(['menu']);
  }
}

@Component({
  selector: 'dialog-status-edit-page',
  templateUrl: './dialog-status-edit-page.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class DialogStatusEditPage {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStatusEditPage>
  ) {}

  onDelete(condition: string) {
    this.dialogRef.close({ data: condition });
  }
}
