import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IHistorySelling, IProduct } from '../models/products-models';
import { IMember, IUser } from '../models/users-models';

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

  deleteProduct(id: string) {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('products')
      .doc(id)
      .delete();
  }

  ///// end api product /////

  ///// api member /////

  addNewMember(data: IMember) {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('member')
      .doc()
      .set({
        memberName: data.memberName,
        mobileNumber: data.mobileNumber,
        lastorderTimestamp: '',
      });
  }

  queryMemberByMobile(mobile: string) {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('member', (ref) => ref.where('mobileNumber', '==', mobile))
      .valueChanges({
        idField: 'id',
      });
  }

  updateMember(id: string, data: IMember) {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('member')
      .doc(id)
      .update({
        memberName: data.memberName,
        mobileNumber: data.mobileNumber,
        lastorderTimestamp: data.lastorderTimestamp,
      });
  }

  deleteMember(id: string) {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('member')
      .doc(id)
      .delete();
  }

  ///// end api member /////

  ///// api history /////

  addHistory(data: IHistorySelling) {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('historys')
      .doc()
      .set({
        productName: data.productName,
        qty: data.qty,
        price: data.price,
        category: data.category,
        memberName: data.memberName,
        mobileNumber: data.memberMobile,
        timeStamp: '',
      });
  }

  getHistory() {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('historys')
      .valueChanges({ idField: 'id' });
  }

  deleteHistory(id: string) {
    return this.firestore
      .collection('users')
      .doc(this.getUser.username)
      .collection('historys')
      .doc(id)
      .delete();
  }

  ///// end api history /////
}
