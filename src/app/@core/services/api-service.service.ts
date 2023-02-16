import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { IHistorySelling, IProduct } from '../models/products-models';
import { IMember, IUser } from '../models/users-models';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  getUser = JSON.parse(localStorage.getItem('UData') as string);
  constructor(
    private firestore: AngularFirestore,
    private firestoreage: AngularFireStorage
  ) {}

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
    if (!this.getUser) {
      location.reload();
    }
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
        timeStamp: data.timeStamp,
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

  // ///// api upload image /////

  // async uploadImageUser(event: any) {
  //   const file = event.target.files[0];
  //   const storage = getStorage(initializeApp(environment.firebaseConfig));
  //   const storageRef = ref(storage, `${this.getUser.username}/${file.name}`);
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   return uploadTask.on(
  //     'state_changed',
  //     (snapshot) => {
  //       // Upload progress
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log(`Upload is ${progress}% done`);
  //     },
  //     (error) => {
  //       // Error uploading file
  //       console.error(error);
  //     },
  //     async () => {
  //       // Upload success
  //       const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //       console.log(`File available at ${downloadURL}`);
  //     }
  //   );
  // }

  // ///// end api upload image /////
}
