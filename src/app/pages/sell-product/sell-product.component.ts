import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
})
export class SellProductComponent implements OnInit {
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

  constructor() {}
  ngOnInit(): void {}

  onEvent(e: ScannerQRCodeResult[]): void {
    this.showScannerResult = e;
    if (e[0].typeName !== 'ZBAR_QRCODE') {
      this.value = e[0].value;
      alert('data' + e[0].value);
      console.log(e);
    }
  }

  handle(action: any, fn: string): void {
    action[fn]()
      .pipe(
        tap(() => {
          this.showData = action.devices._value;
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
    action.playDevice(
      findFacingback !== -1 ? data[findFacingback].deviceId : 0
    );
  }
}
