import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { tap } from 'rxjs';
import { ServiceSendDataService } from './service-send-data.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  productList = [
    {
      productName: 'AAA',
      productCode: 'AAA1212',
      price: '10',
    },
    {
      productName: 'BBB',
      productCode: 'BBB2222',
      price: '20',
    },
    {
      productName: 'CCC',
      productCode: 'CCC3333',
      price: '30',
    },
    {
      productName: 'DDD',
      productCode: 'DDD4444',
      price: '40',
    },
  ];

  constructor(
    public dialog: MatDialog,
    private serviceSendData: ServiceSendDataService
  ) {}

  ngOnInit(): void {}

  openDialog(item: any): void {
    this.serviceSendData.setProductItem(item);
    this.dialog.open(DialogEditProduct, {});
  }
}

@Component({
  selector: 'dialog-edit-product',
  templateUrl: './dialog-edit-product.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class DialogEditProduct {
  editProductForm = this.fb.group({
    productName: ['', Validators.required],
    productCode: ['', Validators.required],
    price: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogEditProduct>,
    private serviceSendData: ServiceSendDataService
  ) {}

  ngOnInit(): void {
    this.setProductToFormControl();
  }

  getEditProductFormByName(name: string) {
    return this.editProductForm.get(name) as FormControl;
  }

  setProductToFormControl() {
    this.serviceSendData.productItem$
      .pipe(
        tap((data) => {
          this.editProductForm.setValue({
            productName: data.productName,
            productCode: data.productCode,
            price: data.price,
          });
        })
      )
      .subscribe();
  }

  onSaveEdit() {
    this.dialogRef.close();
  }
}
