import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ScannerQRCodeConfig, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { tap } from 'rxjs';
import { IProduct } from 'src/app/@core/models/products-models';
import { IScannerDevice } from 'src/app/@core/models/scanner-models';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';

@Component({
  selector: 'app-sell-product',
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SellProductComponent implements OnInit {
  sellingForm = this.fb.group({
    mobileMember: [''],
    manualProductCode: [''],
  });

  productInStore: any = [];
  productScanned: IProduct[] = [];
  displayedColumns: string[] = ['productCode', 'productName', 'price', 'qty'];

  showProduct: any = '';

  showData: any;

  deviceIdFacingback: any;
  indexCameraFacingback: any;

  showScannerResult: any;

  value = '';
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
    private apiService: ApiServiceService,
    private route: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.onClickInit();
    this.initGetDataProducts();
  }

  getSellingFormByName(name: string) {
    return this.sellingForm.get(name) as FormControl;
  }

  onClickInit() {
    const btnScanner: HTMLElement = document.getElementById(
      'btnOpenScanner'
    ) as HTMLElement;
    btnScanner.click();
  }

  initGetDataProducts() {
    this.apiService
      .getProducts()
      .pipe(
        tap((value) => {
          this.productInStore = value;
          console.log(this.productInStore);
        })
      )
      .subscribe();
  }

  onEvent(e: ScannerQRCodeResult[]): void {
    this.showScannerResult = e;
    if (e[0].typeName !== 'ZBAR_QRCODE') {
      this.value = e[0].value;
      // alert('data' + e[0].value);
      const findProductInStore = this.productInStore.find(
        (code: any) => e[0].value == code.productCode
      );
      this.showProduct = findProductInStore;
      if (findProductInStore) {
        this.productScanned.push(findProductInStore);
      }

      console.log(findProductInStore);

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

  onBack() {
    this.route.navigate(['menu']);
  }
}
