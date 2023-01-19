import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeSelectedFiles,
  ScannerQRCodeResult,
  NgxScannerQrcodeComponent,
} from 'ngx-scanner-qrcode';
import { tap } from 'rxjs';
import { IScannerDevice } from 'src/app/@core/models/scanner-models';
@Component({
  selector: 'app-sell-product',
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.scss'],
})
export class SellProductComponent implements OnInit {
  showData: any;

  deviceIdFacingback: any;
  indexCameraFacingback: any;

  showScannerResult:any

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

  constructor() {}
  ngOnInit(): void {}

  onEvent(e: ScannerQRCodeResult[]): void {
    this.value = e[0].value;
    alert('data' + e[0].value);
    console.log(e);
  }

  handle(action: any, fn: string): void {
    action[fn]()
      .pipe(
        tap((value) => {
          this.showData = action.devices._value;
          this.showScannerResult = value
        })
      )
      .subscribe(() => {
        console.log, alert;
        this.setCameraFacingback(action, this.showData);
      });
  }

  setCameraFacingback(action: any, data: IScannerDevice[]): void {
    const findFacingback = data.findIndex(
      (data: IScannerDevice) => data.label == 'camera2 0, facing back'
    );
    this.indexCameraFacingback = findFacingback;
    this.deviceIdFacingback = data[findFacingback].deviceId;
    action.playDevice(data[findFacingback].deviceId);
  }
}
