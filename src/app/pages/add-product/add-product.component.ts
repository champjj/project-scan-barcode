import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  addProduct = this.fb.group({
    productName: ['', Validators.required],
    productCode: ['', Validators.required],
    price: ['', Validators.required],
    quantity: ['1', Validators.required],
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnInit(): void {}

  getAddProductFormByName(name: string) {
    return this.addProduct.get(name) as FormControl;
  }
  onSave() {
    this.location.back();
  }

  onBack() {
    this.location.back();
  }
}
