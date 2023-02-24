import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';

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
    // {
    //   menuName: 'Log out',
    //   // image: '../../../assets/images/product.png',
    //   image: '',
    //   link: 'login',
    // },
  ];

  getUserData = JSON.parse(localStorage.getItem('UData') as string);
  // reloadPage = localStorage.getItem('reloadPage');

  constructor(private route: Router, private apiService: ApiServiceService) {}

  ngOnInit() {
    this.initData();
    if (!localStorage.getItem('reloadPage')) {
      localStorage.setItem('reloadPage', 'no reload');
      location.reload();
    } else {
      localStorage.removeItem('reloadPage');
    }
  }

  initData() {
    this.apiService
      .queryUsername(this.getUserData.username)
      .pipe(
        tap((userData) => {
          console.log(userData);
          if (!userData) {
            localStorage.removeItem('UData');
          }
          localStorage.setItem('UData', JSON.stringify(userData[0]));
        })
      )
      .subscribe();
  }

  onChangePage(link: string) {
    if (link == 'login') localStorage.removeItem('UData');
    this.route.navigate([link]);
  }
}
