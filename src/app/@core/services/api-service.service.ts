import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IUser } from '../models/users-models';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  constructor(private firestore: AngularFirestore) {}

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
}
