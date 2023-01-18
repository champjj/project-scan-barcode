import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeSelectedFiles,
  NgxScannerQrcodeService,
  ScannerQRCodeResult,
} from 'ngx-scanner-qrcode';
@Component({
  selector: 'app-sell-product',
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.scss'],
})
export class SellProductComponent {
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  public config: ScannerQRCodeConfig = {
    // fps: 1000,
    // isAuto: false,
    // isBeep: true,
    // decode: 'macintosh',
    medias: {
      audio: false,
      video: {
        width: window.innerWidth,
      },
    },
  };

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

  constructor(private qrcode: NgxScannerQrcodeService) {}

  public onEvent(e: ScannerQRCodeResult[]): void {
    alert(e[0].value);
    console.log(e);
  }

  public handle(action: any, fn: string): void {
    action[fn]().subscribe(console.log, alert);
  }

  public onDowload(action: any) {
    action.download().subscribe(console.log, alert);
  }

  public onSelects(files: any) {
    this.qrcode
      .loadFiles(files)
      .subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        this.qrCodeResult = res;
      });
  }

  public onSelects2(files: any) {
    this.qrcode
      .loadFilesToScan(files, this.config)
      .subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        console.log(res);
        this.qrCodeResult2 = res;
      });
  }
}
