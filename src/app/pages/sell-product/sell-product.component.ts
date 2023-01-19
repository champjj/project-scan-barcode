import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeSelectedFiles,
  ScannerQRCodeResult,
  NgxScannerQrcodeComponent,
} from 'ngx-scanner-qrcode';
import { tap } from 'rxjs';
@Component({
  selector: 'app-sell-product',
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.scss'],
})
export class SellProductComponent implements OnInit {
  testDevices = [
    {
      deviceId:
        '9764f941a3501fb758bcf681a998d4f2dfd29a5532ddc39e41285b7453199add',
      kind: 'videoinput',
      label: 'camera2 1, facing front',
      groupId:
        '534dd109ed61981065d28507586f490aa13c9d5661c8bc3404ae32f59bed45b9',
    },
    {
      deviceId:
        '0fe69b7ae2d3350b9ffad5e32a6d4789b50796403772ec0c9f6d1c6555c56841',
      kind: 'videoinput',
      label: 'camera2 0, facing back',
      groupId:
        '41d152dac4bf35acb5ed3b26dece6cfdfe1d4582e81d8075098f823693ca6bbb',
    },
  ];

  data = {
    closed: false,
    currentObservers: [],
    observers: [],
    isStopped: false,
    hasError: false,
    thrownError: null,
    _value: [
      {
        deviceId:
          '9764f941a3501fb758bcf681a998d4f2dfd29a5532ddc39e41285b7453199add',
        kind: 'videoinput',
        label: 'camera2 1, facing front',
        groupId:
          '6476d62b3d75a282ca110c191062be7d07287f0ce620aecfd62a29807127bf16',
      },
      {
        deviceId:
          '0fe69b7ae2d3350b9ffad5e32a6d4789b50796403772ec0c9f6d1c6555c56841',
        kind: 'videoinput',
        label: 'camera2 0, facing back',
        groupId:
          'ab1e2dc5cf22dced4917f8cd4d019c8e9279b93afb3bea8c6c835fa06f1eba7d',
      },
    ],
  };

  showData: any;

  deviceIdFacingback: any;
  indexCameraFacingback: any;

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
        tap(() => {
          this.showData = action.devices._value;
          const findFacingBack = action!.devices!._value.findIndex(
            (data: any) => data.label == 'camera2 0, facing back'
          );
          this.indexCameraFacingback = findFacingBack;
          this.deviceIdFacingback = action.devices[findFacingBack]!.deviceId;
          action.playDevice(action.devices[findFacingBack]!.deviceId);
        })
      )
      .subscribe(console.log, alert);
  }
}
