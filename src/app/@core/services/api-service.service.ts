import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IProduct } from '../models/products-models';
import { IUser } from '../models/users-models';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  getUser = JSON.parse(localStorage.getItem('UData') as string);
  constructor(private firestore: AngularFirestore) {}

  ///// api user /////
  addNewUser(data: IUser) {
    return this.firestore.collection('users').doc(data.username).set({
      username: data.username,
      password: data.password,
      shopname: data.shopname,
      mobileNumber: data.mobileNumber,
      email: data.email,
      discountMember: data.discountMember,
      imageShop: data.imageShop,
    });
  }

  getDataUser() {
    return this.firestore.collection('users').valueChanges();
  }

  queryUsername(username: string) {
    return this.firestore
      .collection('users', (ref) => ref.where('username', '==', username))
      .valueChanges();
  }

  updateUserData(data: IUser) {
    return this.firestore.collection('users').doc(data.username).update({
      username: data.username,
      password: data.password,
      shopname: data.shopname,
      mobileNumber: data.mobileNumber,
      email: data.email,
      discountMember: data.discountMember,
      imageShop: data.imageShop,
    });
  }
  ///// end api user /////

  ///// api product /////

  getProducts() {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('products')
      .valueChanges({ idField: 'id' });
  }

  queryProductByCode(code: string | null) {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('products', (ref) => ref.where('productCode', '==', code))
      .valueChanges({
        idField: 'id',
      });
  }

  createProduct(id: string, data: IProduct) {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('products')
      .doc()
      .set({
        productName: data.productName,
        productCode: data.productCode,
        imageProduct: data.imageProduct,
        qty: data.qty,
        price: data.price,
        category: data.category,
      });
  }

  updateProduct(id: string, data: IProduct) {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('products')
      .doc(id)
      .update({
        productName: data.productName,
        productCode: data.productCode,
        imageProduct: data.imageProduct,
        qty: data.qty,
        price: data.price,
        category: data.category,
      });
  }

  deleteProduct(username: string, productCode: string) {
    return this.firestore
      .collection('users')
      .doc(username)
      .collection('products')
      .doc(productCode)
      .delete();
  }

  ///// end api product /////
}
