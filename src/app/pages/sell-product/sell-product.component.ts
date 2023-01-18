import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
@Component({
  selector: 'app-sell-product',
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.scss'],
})
export class SellProductComponent {
  value = '';

  constructor(private barcodeScanner: BarcodeScanner) {}
  ngOninit() {}

  barCode() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        this.value = barcodeData.text;
        console.log('Barcode data', barcodeData);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }
}
