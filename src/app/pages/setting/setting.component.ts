import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/@core/models/users-models';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  settingInfo = this.fb.group({
    username: [''],
    password: [''],
    shopname: [''],
    mobileNumber: [''],
    email: ['', [Validators.email]],
    discountMember: [''],
    imageShop: [''],
  });

  getUserData = JSON.parse(localStorage.getItem('UData') as string);

  downloadURL = '';

  showSpinner = false;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private apiService: ApiServiceService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.initDataSetting();
  }

  initDataSetting() {
    if (this.getUserData) {
      this.settingInfo.setValue({
        username: this.getUserData.username,
        password: this.getUserData.password,
        shopname: this.getUserData.shopname,
        mobileNumber: this.getUserData.mobileNumber,
        email: this.getUserData.email,
        discountMember: this.getUserData.discountMember,
        imageShop: this.getUserData.imageShop,
      });
    } else {
      location.reload();
    }
  }

  disabledSettingBtn() {
    return this.settingInfo.invalid;
  }

  getSettingInfoByName(name: string) {
    return this.settingInfo.get(name) as FormControl;
  }

  onSave() {
    const userData: IUser = {
      username: this.getSettingInfoByName('username').value,
      password: this.getSettingInfoByName('password').value,
      shopname: this.getSettingInfoByName('shopname').value,
      mobileNumber: this.getSettingInfoByName('mobileNumber').value,
      email: this.getSettingInfoByName('email').value,
      discountMember: this.getSettingInfoByName('discountMember').value,
      imageShop: this.downloadURL,
    };
    this.apiService.updateUserData(userData).then(() => {
      this.apiService
        .queryUsername(userData.username)
        .subscribe((data) =>
          localStorage.setItem('UData', JSON.stringify(data[0]))
        );
      this.route.navigate(['menu']);
    });
  }

  onUploadImage(event: any) {
    console.log(event.target.files[0]);

    const file = event.target.files[0];
    const storage = getStorage(initializeApp(environment.firebaseConfig));
    const storageRef = ref(
      storage,
      `${this.getUserData.username}/${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        this.showSpinner = true;
      },
      (error) => {
        // Error uploading file
        console.error(error);
        this.showSpinner = false;
      },
      async () => {
        // Upload success
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        this.downloadURL = downloadURL;
        console.log(`File available at ${downloadURL}`);
        if (this.downloadURL) {
          this.showSpinner = false;
        }
      }
    );
  }

  clearImage() {
    this.downloadURL = '';
  }

  onBack() {
    this.route.navigate(['menu']);
  }
}
