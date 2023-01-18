import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sell-product',
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.scss'],
})
export class SellProductComponent {
  value!: string;
  isError = false;

  onError(error: any) {
    console.error(error);
    this.isError = true;
  }
}
