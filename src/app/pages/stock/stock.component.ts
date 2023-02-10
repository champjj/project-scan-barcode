import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';

interface IArrValue {
  value: string;
  date: string;
}

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  lineChartData = [{ data: [0], label: 'sales' }];
  lineChartLabels = [''];
  lineChartOptions = {
    responsive: true,
  };
  lineChartColors = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  bestSellerList = new BehaviorSubject<any>('');
  bestSellerList$ = this.bestSellerList.asObservable();

  arrValue = [] as IArrValue[];

  today = new Date().getTime();

  constructor(private route: Router, private apiService: ApiServiceService) {}

  ngOnInit(): void {
    this.initGetHistorySelling();
  }

  initGetHistorySelling() {
    this.apiService
      .getHistory()
      .pipe(
        tap((history) => {
          history.map((val, index, arr) => {
            let setDateToLocalDate = new Date(
              val['timeStamp']
            ).toLocaleDateString('th', {
              month: '2-digit',
              day: '2-digit',
            });

            ///// set 7 day sales for draft chart /////
            if (val['timeStamp'] > this.today - 86400000 * 7) {
              this.arrValue.push({
                value: val['qty'],
                date: setDateToLocalDate,
              });
              return setDateToLocalDate;
            } else {
              return setDateToLocalDate;
            }
          });

          const sortDataValueAndPrice = this.arrValue.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          const showDate = sortDataValueAndPrice.map((data) => data.date);
          let countIndex = -1;
          let oldDate = '';
          sortDataValueAndPrice.map((data, index, arr) => {
            if (oldDate == data.date) {
              this.lineChartData[0].data[countIndex] =
                this.lineChartData[0].data[countIndex] + +data.value;
            } else {
              oldDate = data.date;
              countIndex++;

              this.lineChartData[0].data[countIndex] = +data.value;
            }
          });
          this.lineChartLabels = [...new Set(showDate)];
          ///// end set 7 day sales for draft chart /////

          ///// list most best seller /////

          console.log(history);

          let countIndexForBestSeller = -1;
          let oldProductname = '';
          let mergeProductByName: any = [];

          history.map((val, index, arr) => {
            const filterProduct = mergeProductByName.filter(
              (value: any) => value.productName == val['productName']
            );
            console.log(filterProduct.length);

            if (filterProduct.length == 0) {
              console.log(true);

              mergeProductByName.push(val);
            } else {
              console.log(false);

              const removeItem = mergeProductByName.filter(
                (value: any) => value.productName !== val['productName']
              );

              console.log(removeItem);

              const mergeDataForQty = {
                ...val,
                qty: filterProduct[0].qty + val['qty'],
              };

              console.log(removeItem);

              mergeProductByName = removeItem;
              mergeProductByName.push(mergeDataForQty);
            }
          });

          const setTopSeller = mergeProductByName
            .sort((a: any, b: any) => b['qty'] - a['qty'])
            .slice(0, 10);
          console.log(setTopSeller);
          this.bestSellerList.next(setTopSeller);
          ///// end list most best seller /////
        })
      )
      .subscribe();
  }

  onBack() {
    this.route.navigate(['menu']);
  }
}
