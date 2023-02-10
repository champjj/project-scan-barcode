import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  menuArray = [
    {
      menuName: 'Sell Product',
      image: '../../../assets/images/sellproduct.png',
      link: 'sell-product',
    },
    {
      menuName: 'Add Product',
      image: '../../../assets/images/addproduct.png',
      link: 'add-product',
    },
    {
      menuName: 'Edit Product',
      image: '../../../assets/images/report.png',
      link: 'edit-product',
    },
    {
      menuName: 'Report',
      image: '../../../assets/images/product.png',
      link: 'stock',
    },
    {
      menuName: 'Log out',
      // image: '../../../assets/images/product.png',
      image: '',
      link: 'login',
    },
  ];

  getUserData = JSON.parse(localStorage.getItem('UData') as string);

  constructor(private route: Router) {}

  onChangePage(link: string) {
    if (link == 'login') localStorage.removeItem('UData');
    this.route.navigate([link]);
  }
}
