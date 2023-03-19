import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
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

  listProductInWeek = new BehaviorSubject<any>('');
  listProductInWeek$ = this.listProductInWeek.asObservable();

  arrValue = [] as IArrValue[];

  today = new Date().getTime();

  shopData = JSON.parse(localStorage.getItem('UData') as string);

  loadingSpinner = true;

  constructor(private route: Router, private apiService: ApiServiceService) {}

  ngOnInit(): void {
    this.initGetHistorySelling();
  }

  initGetHistorySelling() {
    if (!this.shopData.username) {
      location.reload();
    }
    this.apiService
      .getHistory()
      .pipe(
        tap((history) => {
          history
            .sort(
              (a, b) =>
                new Date(a['timeStamp']).getTime() -
                new Date(b['timeStamp']).getTime()
            )
            .map((val, index, arr) => {
              let setDateToLocalDate: any = new Date(
                val['timeStamp']
              ).toLocaleDateString('th', {
                month: '2-digit',
                day: '2-digit',
              });

              ///// set 7 day sales for draft chart /////
              if (val['timeStamp'] > this.today - 86400000 * 8) {
                this.arrValue.push({
                  value: val['qty'],
                  date: setDateToLocalDate,
                });
                return setDateToLocalDate;
              } else {
                return setDateToLocalDate;
              }
            });
          const sortDataValueAndPrice = this.arrValue;

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
          console.log('lineChartLabels', this.lineChartLabels);
          console.log('lineChartData', this.lineChartData[0].data);

          ///// end set 7 day sales for draft chart /////

          ///// list most best seller /////

          console.log(history);

          let mergeProductByName: any = [];

          history.map((val, index, arr) => {
            const filterProduct = mergeProductByName.filter(
              (value: any) => value.productName == val['productName']
            );
            // console.log(filterProduct.length);

            if (filterProduct.length == 0) {
              // console.log(true);

              mergeProductByName.push(val);
            } else {
              // console.log(false);

              const removeItem = mergeProductByName.filter(
                (value: any) => value.productName !== val['productName']
              );

              // console.log(removeItem);

              const mergeDataForQty = {
                ...val,
                qty: filterProduct[0].qty + val['qty'],
              };

              // console.log(removeItem);

              mergeProductByName = removeItem;
              mergeProductByName.push(mergeDataForQty);
            }
          });

          const setTopSeller = mergeProductByName
            .sort((a: any, b: any) => b['qty'] - a['qty'])
            .slice(0, 5);

          console.log(setTopSeller);
          this.bestSellerList.next(setTopSeller);
          ///// end list most best seller /////
          const forShowDataProductInWeek = history;

          ///// product in week /////
          let mergeProductInWeek: any = [];
          forShowDataProductInWeek
            .sort((a: any, b: any) => b['qty'] - a['qty'])
            .filter((sortData: any) => {
              console.log(sortData);

              if (sortData.timeStamp > this.today - 86400000 * 7) {
                console.log('if', sortData);
                return sortData;
              }
            })
            .map((val, index, arr) => {
              console.log('val', val['productName'], val['qty']);

              const filterProduct = mergeProductInWeek.filter(
                (value: any) => value.productName == val['productName']
              );
              // console.log(filterProduct.length);

              if (filterProduct.length == 0) {
                // console.log(true);

                mergeProductInWeek.push(val);
              } else {
                // console.log(false);

                const removeItem = mergeProductInWeek.filter(
                  (value: any) => value.productName !== val['productName']
                );

                // console.log(removeItem);

                const mergeDataForQty = {
                  ...val,
                  qty: filterProduct[0].qty + val['qty'],
                };

                // console.log(removeItem);
                mergeProductInWeek = removeItem;
                mergeProductInWeek.push(mergeDataForQty);
                console.log('mergeProductInWeek in loop', mergeProductInWeek);
              }
            });
          console.log('mergeProductInWeek', mergeProductInWeek);
          this.listProductInWeek.next(mergeProductInWeek);
          ///// end product in week /////
        })
      )
      .subscribe(() => (this.loadingSpinner = false));
  }

  onBack() {
    this.route.navigate(['menu']);
  }
}
