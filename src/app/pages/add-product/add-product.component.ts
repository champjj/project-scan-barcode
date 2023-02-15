import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ServiceDataAddProductService } from './service-data-add-product.service';
import { ScannerQRCodeConfig, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { tap } from 'rxjs';
import { IScannerDevice } from 'src/app/@core/models/scanner-models';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';
import { IProduct } from 'src/app/@core/models/products-models';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  addProduct = this.fb.group({
    productName: ['', Validators.required],
    productCode: ['', Validators.required],
    price: ['', Validators.required],
    quantity: ['1', Validators.required],
    imageProduct: [''],
    category: ['', Validators.required],
  });

  getUserData = JSON.parse(localStorage.getItem('UData') as string);

  disbledBtnWhenLoad = false;
  catList: string[] = [];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private serviceDataAddProduct: ServiceDataAddProductService,
    private route: Router,
    private apiService: ApiServiceService
  ) {}

  disabledButton() {
    return this.addProduct.invalid || this.disbledBtnWhenLoad;
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    if (!this.getUserData.username) {
      location.reload();
    } else {
      this.apiService
        .getProducts()
        .pipe(
          tap((productList) => {
            ///// set Category
            productList
              .map((value: any) => value.category)
              .forEach((val: any) => {
                if (!this.catList.includes(val)) {
                  this.catList.push(val);
                }
              });
            this.catList.sort();
            console.log(this.catList);
          })
        )
        .subscribe();
    }
  }

  getAddProductFormByName(name: string) {
    return this.addProduct.get(name) as FormControl;
  }

  trackerProductCode() {
    this.serviceDataAddProduct.productCode$
      .pipe(
        tap((code) =>
          this.getAddProductFormByName('productCode').patchValue(code)
        )
      )
      .subscribe();
  }

  onOpenScanner() {
    this.dialog
      .open(DialogAddProduct, {})
      .afterClosed()
      .subscribe(() => this.trackerProductCode());
  }
  onOpenStatus() {
    this.dialog
      .open(DialogAddProductStatus, {})
      .afterClosed()
      .subscribe(() => location.reload());
  }

  onSave() {
    this.disbledBtnWhenLoad = true;
    const dataProduct: IProduct = {
      productName: this.getAddProductFormByName('productName').value,
      productCode: this.getAddProductFormByName('productCode').value,
      imageProduct: this.getAddProductFormByName('imageProduct').value,
      qty: this.getAddProductFormByName('quantity').value,
      price: this.getAddProductFormByName('price').value,
      category: this.getAddProductFormByName('category').value,
    };

    this.apiService
      .createProduct(this.getUserData.username, dataProduct)
      .then(() => this.onOpenStatus())
      .finally(() => (this.disbledBtnWhenLoad = false));
  }

  onBack() {
    this.route.navigate(['menu']);
  }
}

@Component({
  selector: 'dialog-add-product',
  templateUrl: './dialog-add-product.html',
  styleUrls: ['./add-product.component.scss'],
})
export class DialogAddProduct {
  productCode: string = '';

  shopData = JSON.parse(localStorage.getItem('UData') as string);

  ///// scanner
  showData: any;

  deviceIdFacingback: any;
  indexCameraFacingback: any;

  showScannerResult: any;
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  config: ScannerQRCodeConfig = {
    fps: 60,
    // isAuto: false,
    isBeep: true,
    // decode: 'macintosh',
    constraints: {
      audio: false,
      video: {
        width: window.innerWidth,
      },
    },
  };
  constructor(
    public dialogRef: MatDialogRef<DialogAddProduct>,
    private serviceDataAddProduct: ServiceDataAddProductService,
    private apiService: ApiServiceService
  ) {}

  ngOnInit(): void {
    this.onClickInit();
  }

  onClickInit() {
    const btnScanner: HTMLElement = document.getElementById(
      'btnOpenScanner'
    ) as HTMLElement;
    btnScanner.click();
  }

  onEvent(e: ScannerQRCodeResult[]): void {
    this.showScannerResult = e;
    if (e[0].typeName !== 'ZBAR_QRCODE') {
      this.productCode = e[0].value;
      this.onCloseDialog();
      console.log(e);
    }
  }
  handle(action: any, fn: string): void {
    document
      .getElementById('scannerCamera')
      ?.classList.remove('hidden-scanner');
    action[fn]()
      .pipe(
        tap(() => {
          this.showData = action.devices._value;
        })
      )
      .subscribe(
        () => {
          this.setCameraFacingback(action, this.showData);
        },
        () => {},
        () => {}
      );
  }

  setCameraFacingback(action: any, data: IScannerDevice[]): void {
    const findFacingback = data.findIndex(
      (data: IScannerDevice) => data.label == 'camera2 0, facing back'
    );
    this.indexCameraFacingback = findFacingback;
    this.deviceIdFacingback = data[findFacingback].deviceId;
    action.playDevice(
      findFacingback !== -1 ? data[findFacingback].deviceId : 0
    );
  }

  onCloseDialog() {
    if (this.productCode) {
      this.serviceDataAddProduct.setProductCode(this.productCode);
      this.dialogRef.close();
    }
  }
}
@Component({
  selector: 'dialog-add-product-status',
  templateUrl: './dialog-add-product-status.html',
  styleUrls: ['./add-product.component.scss'],
})
export class DialogAddProductStatus {
  constructor(public dialogRef: MatDialogRef<DialogAddProductStatus>) {}
}
