import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ScannerQRCodeConfig, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { tap } from 'rxjs';
import { IProduct } from 'src/app/@core/models/products-models';
import { IScannerDevice } from 'src/app/@core/models/scanner-models';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';
import { DialogAddProduct } from '../../add-product/add-product.component';
import { ServiceDataAddProductService } from '../../add-product/service-data-add-product.service';
import { ServiceEditProductService } from './service-edit-product.service';

@Component({
  selector: 'app-edit-select-product',
  templateUrl: './edit-select-product.component.html',
  styleUrls: ['./edit-select-product.component.scss'],
})
export class EditSelectProductComponent implements OnInit {
  editProduct = this.fb.group({
    productName: ['', Validators.required],
    productCode: ['', Validators.required],
    price: ['', Validators.required],
    quantity: ['1', Validators.required],
    imageProduct: [''],
    category: ['', Validators.required],
  });

  disbledBtnWhenLoad = false;

  idProduct = '';

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private serviceEditProduct: ServiceEditProductService,
    private route: Router,
    private apiService: ApiServiceService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProduct();
  }

  disabledButton() {
    return this.editProduct.invalid || this.disbledBtnWhenLoad;
  }

  getEditProductFormByName(name: string) {
    return this.editProduct.get(name) as FormControl;
  }

  getProduct() {
    const code = this.router.snapshot.paramMap.get('code');
    this.apiService
      .queryProductByCode(code)
      .pipe(
        tap((data) => {
          console.log(data);
          this.idProduct = data[0].id;
        })
      )
      .subscribe((data) => this.setFormControl(data[0]));
  }
  setFormControl(data: any) {
    this.editProduct.setValue({
      productName: data.productName,
      productCode: data.productCode,
      price: data.price,
      quantity: data.qty,
      imageProduct: data.imageProduct,
      category: data.category,
    });
  }
  onOpenScanner() {
    this.dialog
      .open(DialogAddProduct, {})
      .afterClosed()
      .subscribe(() => this.trackerProductCode());
  }

  trackerProductCode() {
    this.serviceEditProduct.productCode$
      .pipe(
        tap((code) => {
          alert('trackerProductCode22 ' + code);
          this.getEditProductFormByName('productCode').patchValue(code);
        })
      )
      .subscribe();
  }

  onSave() {
    this.disbledBtnWhenLoad = true;
    const dataProduct: IProduct = {
      productName: this.getEditProductFormByName('productName').value,
      productCode: this.getEditProductFormByName('productCode').value,
      imageProduct: this.getEditProductFormByName('imageProduct').value,
      qty: this.getEditProductFormByName('quantity').value,
      price: this.getEditProductFormByName('price').value,
      category: this.getEditProductFormByName('category').value,
    };

    this.apiService
      .updateProduct(this.idProduct, dataProduct)
      .then(() => this.onOpenStatus());
  }

  onOpenStatus() {
    this.dialog
      .open(DialogEditStatus, {})
      .afterClosed()
      .subscribe(() => this.onBack());
  }
  onBack() {
    this.route.navigate(['edit-product']);
  }
}

@Component({
  selector: 'dialog-edit-scanner',
  templateUrl: './dialog-edit-scanner.html',
  styleUrls: ['./edit-select-product.component.scss'],
})
export class DialogEditScanner {
  productCode: string = '';

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
    medias: {
      audio: false,
      video: {
        width: window.innerWidth,
      },
    },
  };
  constructor(
    public dialogRef: MatDialogRef<DialogAddProduct>,
    private serviceDataAddProduct: ServiceDataAddProductService
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
      this.serviceDataAddProduct.setProductCode(e[0].value);
      this.onCloseDialog(e[0].value);
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

  onCloseDialog(barcode: string) {
    alert('onCloseDialog' + barcode);
    if (this.productCode) {
      this.dialogRef.close();
    }
  }
}
@Component({
  selector: 'dialog-edit-status',
  templateUrl: './dialog-edit-status.html',
  styleUrls: ['./edit-select-product.component.scss'],
})
export class DialogEditStatus {
  constructor(public dialogRef: MatDialogRef<DialogEditStatus>) {}
}
