import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ScannerQRCodeConfig, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { min, tap } from 'rxjs';
import {
  IHistorySelling,
  IProduct,
} from 'src/app/@core/models/products-models';
import { IScannerDevice } from 'src/app/@core/models/scanner-models';
import { IMember } from 'src/app/@core/models/users-models';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';

@Component({
  selector: 'app-sell-product',
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SellProductComponent implements OnInit {
  shopData = JSON.parse(localStorage.getItem('UData') as string);

  sellingForm = this.fb.group({
    mobileMember: ['', [Validators.required]],
    manualProductCode: [''],
  });

  stopScanner = false;

  today = new Date().getTime();

  dataMember: any;
  cacheMember = false;

  productInStore: any = [];
  productScanned: IProduct[] = [];
  totalPrice = 0;

  showProduct: any = '';

  showData: any;

  deviceIdFacingback: any;
  indexCameraFacingback: any;

  showScannerResult: any;

  value = '';
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  config: ScannerQRCodeConfig = {
    fps: 60,
    // isAuto: false,
    isBeep: !this.stopScanner,
    // decode: 'macintosh',
    constraints: {
      audio: false,
      video: {
        width: window.innerWidth,
      },
    },
  };

  constructor(
    private apiService: ApiServiceService,
    private route: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.onClickInit();
    this.initGetDataProducts();
  }

  disabledBtnOrder() {
    return this.productScanned.length == 0;
  }

  getSellingFormByName(name: string) {
    return this.sellingForm.get(name) as FormControl;
  }

  onClickInit() {
    const btnScanner: HTMLElement = document.getElementById(
      'btnOpenScanner'
    ) as HTMLElement;
    btnScanner.click();
  }

  initGetDataProducts() {
    if (!this.shopData.username) {
      location.reload();
    }
    this.apiService
      .getProducts()
      .pipe(
        tap((value) => {
          this.productInStore = value;
          console.log(this.productInStore);
        })
      )
      .subscribe();
  }

  onOpenDialog(codeCase: string, item: any = '') {
    ///// condition check close dialog by button
    if (item !== '') {
      this.dialog
        .open(DialogSelling, {
          data: { codeCase, item },
          disableClose: true,
        })
        .afterClosed()
        .subscribe((data) => {
          // console.log(data.data);

          switch (codeCase) {
            case 'adjust-qty':
              if (+data.data.qty !== 0) {
                console.log('true');

                this.productScanned[data.data.index].qty = +data.data.qty;
              } else {
                console.log('else');

                const removeItem = this.productScanned.filter(
                  (value, index, arr) => index !== data.data.index
                );

                this.productScanned = removeItem;
              }
              break;
            case 'remove-all-item':
              if (data.data == 'confirm') {
                this.productScanned = [];
              }
              break;
            case 'confirm-order':
              if (data.data == 'confirm') {
                const confirmOrder = {
                  order: this.productScanned,
                  totalPrice: this.totalPrice,
                  memberMobile: this.dataMember
                    ? this.dataMember.mobileNumber
                    : '',
                  memberName: this.dataMember ? this.dataMember.memberName : '',
                };

                this.onOpenDialog('bill', confirmOrder);
                this.setHistorySelling();
              }
              break;

            default:
              break;
          }

          this.updateTotalPrice();

          this.stopScanner = false;
        });
    } else {
      this.dialog
        .open(DialogSelling, {
          data: { codeCase, item },
        })
        .afterClosed()
        .subscribe(() => {
          this.stopScanner = false;
        });
    }
  }

  adjustQTY(index: number, item: any) {
    const mergeData = {
      ...item,
      index: index,
    };
    this.onOpenDialog('adjust-qty', mergeData);
  }

  updateTotalPrice() {
    ///// calculate total price
    const calculateTotalPrice = this.productScanned;

    this.totalPrice = calculateTotalPrice
      .map((itemInTable) => itemInTable.price * itemInTable.qty)
      .reduce((a, b) => a + b, 0);

    console.log(this.totalPrice);
  }

  onClearAllOrder() {
    this.onOpenDialog('remove-all-item', 'remove-all-item');
  }

  onConfirmOrder() {
    this.onOpenDialog('confirm-order', 'confirm-order');
  }

  setHistorySelling() {
    console.log('this.dataMember', this.dataMember);

    this.productScanned.forEach((data) => {
      console.log(data);

      this.updateAllDataForSelling(data);
    });
    this.productScanned = [];
    this.initGetDataProducts();

    ///// updateLastOrderMember
    if (this.dataMember) {
      const memberTimeStamp: IMember = {
        memberName: this.dataMember.memberName,
        mobileNumber: this.dataMember.mobileNumber,
        lastorderTimestamp: this.today,
      };
      this.apiService
        .updateMember(this.dataMember.id, memberTimeStamp)
        .finally();
    }
  }

  ///// update stock , member , history
  updateAllDataForSelling(data: IProduct | any) {
    ///// add History selling
    const dataHistory: IHistorySelling = {
      productName: data.productName,
      qty: data.qty,
      price: data.price,
      category: data.category,
      timeStamp: this.today,
      memberName: this.dataMember ? this.dataMember.memberName : '',
      memberMobile: this.dataMember ? this.dataMember!.mobileNumber : '',
    };
    this.apiService.addHistory(dataHistory);
    console.log(dataHistory);

    ///// calculate stock

    const productInStock = this.productInStore
      .filter((products: any) => products.id == data.id)
      .shift();
    console.log(productInStock);

    const dataStock: IProduct = {
      ...data,
      qty: productInStock.qty - data.qty,
    };
    console.log(dataStock);
    this.apiService.updateProduct(data.id, dataStock);
  }

  manualAddBarcode() {
    const findProductInStore = this.productInStore.find(
      (code: any) =>
        this.getSellingFormByName('manualProductCode').value == code.productCode
    );
    console.log(findProductInStore);

    this.showProduct = findProductInStore;
    if (!!findProductInStore) {
      if (findProductInStore.length !== 0) {
        let arrProduct = {
          ...findProductInStore,
          qty: 1,
        };
        const findProduceInTable = this.productScanned.findIndex(
          (dataInTable) =>
            dataInTable.productCode == findProductInStore.productCode
        );

        ///// if table already product +1
        if (findProduceInTable !== -1) {
          this.productScanned[findProduceInTable].qty++;
        } else {
          this.productScanned.push(arrProduct);
        }

        this.stopScanner = true;
        this.onOpenDialog('scan-success');
        this.updateTotalPrice();
        console.log(this.productScanned);
      }
    } else {
      this.onOpenDialog('no-product');
    }
  }

  onEvent(e: ScannerQRCodeResult[]): void {
    this.showScannerResult = e;
    if (e[0].typeName !== 'ZBAR_QRCODE' && !this.stopScanner) {
      this.value = e[0].value;
      // alert('data' + e[0].value);
      const findProductInStore = this.productInStore.find(
        (code: any) => e[0].value == code.productCode
      );
      this.showProduct = findProductInStore;
      if (findProductInStore.length !== 0) {
        let arrProduct = {
          ...findProductInStore,
          qty: 1,
        };
        const findProduceInTable = this.productScanned.findIndex(
          (dataInTable) =>
            dataInTable.productCode == findProductInStore.productCode
        );

        ///// if table already product +1
        if (findProduceInTable !== -1) {
          this.productScanned[findProduceInTable].qty++;
        } else {
          this.productScanned.push(arrProduct);
        }

        this.stopScanner = true;
        this.onOpenDialog('scan-success');

        this.updateTotalPrice();
      }

      console.log(findProductInStore);

      console.log(e);
    }
  }
  handle(action: any, fn: string): void {
    document
      .getElementById('scannerCamera')
      ?.classList.remove('hidden-scanner');
    action[fn]()
      .pipe(
        tap(() => {
          alert(this.showData);
          this.showData = action.devices._value;
        })
      )
      .subscribe(
        () => {
          this.setCameraFacingback(action, this.showData);
        },
        () => {},
        () => {}
      );
  }

  setCameraFacingback(action: any, data: IScannerDevice[]): void {
    const findFacingback = data?.findIndex(
      (data: IScannerDevice) => data.label == 'camera2 0, facing back'
    );
    this.indexCameraFacingback = findFacingback;
    this.deviceIdFacingback = data[findFacingback].deviceId;
    action.playDevice(
      findFacingback !== -1 ? data[findFacingback].deviceId : 0
    );
  }

  onSetMember() {
    this.cacheMember = false;
    this.apiService
      .queryMemberByMobile(this.getSellingFormByName('mobileMember').value)
      .pipe(
        tap((data) => {
          // console.log(data);
          if (data.length == 0) {
            this.cacheMember = false;
            this.onOpenDialog('no-member');
            this.getSellingFormByName('mobileMember').patchValue('');
          } else if (!this.cacheMember) {
            this.cacheMember = true;
            this.onOpenDialog('member-success');
            console.log(data[0]['memberName']);

            const memberValue = {
              id: data[0].id,
              memberName: data[0]['memberName'],
              mobileNumber: data[0]['mobileNumber'],
              lastorderTimestamp: data[0]['lastorderTimestamp'],
            };
            this.dataMember = memberValue;
          }
        })
      )
      .subscribe(() => console.log('this.dataMember', this.dataMember));
  }

  onRegisterMemberPopup() {
    this.onOpenDialog('register-member', 'register-member');
  }

  onBack() {
    this.route.navigate(['menu']);
  }
}

@Component({
  selector: 'dialog-selling',
  templateUrl: './dialog-selling.html',
  styleUrls: ['./sell-product.component.scss'],
})
export class DialogSelling {
  shopData = JSON.parse(localStorage.getItem('UData') as string);

  itemForm = this.fb.group({
    qty: [0, [Validators.required]],
  });

  registerMemberForm = this.fb.group({
    memberName: ['', [Validators.required]],
    memberNumber: ['', [Validators.required]],
  });

  today = new Date();

  cacheMemberData = 0;

  totalPrice = 0;
  discountPrice = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogSelling>,
    private apiService: ApiServiceService
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.setQtyItem();
  }

  disabledRegisterBtn() {
    return this.registerMemberForm.invalid;
  }

  getItemFormByName(name: string) {
    return this.itemForm.get(name) as FormControl;
  }
  getRegisterMemberFormByName(name: string) {
    return this.registerMemberForm.get(name) as FormControl;
  }

  setQtyItem() {
    if (this.data.codeCase == 'adjust-qty') {
      const qty = this.data.item.qty;
      this.getItemFormByName('qty').patchValue(qty);
    }
    if (this.data.codeCase == 'bill') {
      console.log('this.shopData.discountMember', this.shopData.discountMember);

      const totalPrice = Math.floor(this.data.item.totalPrice);
      const discount = Math.floor(
        (this.shopData.discountMember / 100) * totalPrice
      );

      this.discountPrice = discount;

      this.totalPrice = this.data.item.memberName
        ? totalPrice - discount
        : totalPrice;

      console.log(this.data.item);
      console.log({ discount });
    }
  }

  onRegisterMember() {
    this.apiService
      .queryMemberByMobile(
        this.getRegisterMemberFormByName('memberNumber').value
      )
      .pipe(
        tap((data) => {
          console.log(data);
          if (data.length == 0) {
            this.setDataNewMember();
            this.cacheMemberData = 1;
          } else if (this.cacheMemberData == 0) {
            this.data.codeCase = 'register-fail';
          }
        })
      )
      .subscribe();
  }

  setDataNewMember() {
    const data: IMember = {
      memberName: this.getRegisterMemberFormByName('memberName').value,
      mobileNumber: this.getRegisterMemberFormByName('memberNumber').value,
      lastorderTimestamp: '',
    };
    this.apiService
      .addNewMember(data)
      .then(() => {})
      .finally(() => {
        this.data.codeCase = 'register-success';
      });
  }

  backToRegisterDialog() {
    this.data.codeCase = 'register-member';
    this.cacheMemberData = 0;
  }

  onCloseDialog(command: string = '') {
    switch (this.data.codeCase) {
      case 'adjust-qty':
        this.dialogRef.close({
          data: {
            qty: this.getItemFormByName('qty').value,
            index: this.data.item.index,
          },
        });
        break;

      case 'remove-all-item':
        this.dialogRef.close({
          data: command,
        });
        break;
      case 'confirm-order':
        this.dialogRef.close({
          data: command,
        });
        break;
      case 'bill':
        this.dialogRef.close();
        break;
      case 'register-member':
        this.dialogRef.close();
        break;
      case 'register-success':
        this.dialogRef.close();
        break;
    }
  }
}
