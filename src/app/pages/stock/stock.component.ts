import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  porductList = [
    {
      productName: 'AAA',
      productCode: 'AAA1212',
      price: '10',
      qty: '5',
    },
    {
      productName: 'BBB',
      productCode: 'BBB2222',
      price: '20',
      qty: '15',
    },
    {
      productName: 'CCC',
      productCode: 'CCC3333',
      price: '30',
      qty: '9',
    },
    {
      productName: 'DDD',
      productCode: 'DDD4444',
      price: '40',
      qty: '3',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
