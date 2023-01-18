import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeSelectedFiles,
  ScannerQRCodeResult,
} from 'ngx-scanner-qrcode';
@Component({
  selector: 'app-sell-product',
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.scss'],
})
export class SellProductComponent {
  value = '';
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  config: ScannerQRCodeConfig = {
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

  constructor() {}

  ngOnInit() {}

  onEvent(e: ScannerQRCodeResult[]): void {
    this.value = e[0].value;
    alert('data' + e);
    console.log(e);
  }

  handle(action: any, fn: string): void {
    action[fn]().subscribe(console.log, alert);
  }
}
