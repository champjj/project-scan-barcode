import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';
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

  oldDataProductList = new BehaviorSubject<IProduct[] | undefined>(undefined);
  oldDataProductList$ = this.oldDataProductList.asObservable();

  selectCat = '';
  catList: string[] = [];

  searchForm = this.fb.group({
    searchName: [''],
    searchCategory: [''],
  });

  constructor(
    private fb: FormBuilder,
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
          this.oldDataProductList.next(productList);
          ///// set Category
          productList.map((value: any) => this.catList.push(value.category));
        })
      )
      .subscribe((productList) => {
        console.log({ productList });
      });
  }

  disabledSearchBtn() {
    return (
      !this.getSearchFormByName('searchName').value &&
      !this.getSearchFormByName('searchCategory').value
    );
  }

  getSearchFormByName(name: string) {
    return this.searchForm.get(name) as FormControl;
  }

  onSearch() {
    // this.getSearchFormByName('searchCategory').value

    this.oldDataProductList$
      .pipe(
        map((currentProduct) => {
          ///// filter category
          if (this.getSearchFormByName('searchCategory').value) {
            return currentProduct?.filter(
              (data) =>
                data.category ==
                this.getSearchFormByName('searchCategory').value
            );
          } else {
            return currentProduct;
          }
        }),
        map((secondProduct) => {
          ///// filter product name
          if (this.getSearchFormByName('searchName').value) {
            return secondProduct?.filter(
              (data) =>
                data.productName
                  .toLowerCase()
                  .indexOf(
                    this.getSearchFormByName('searchName').value.toLowerCase()
                  ) > -1
            );
          } else {
            return secondProduct;
          }
        }),
        tap((newData) => this.productList.next(newData))
      )
      .subscribe();
  }

  onClearSearch() {
    this.searchForm.setValue({
      searchName: '',
      searchCategory: '',
    });
    this.initDataProducts();
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
