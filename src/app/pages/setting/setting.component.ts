import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  settingInfo = this.fb.group({
    username: ['', [Validators.required]],
    password: [''],
    shopname: ['', [Validators.required]],
    mobileNumber: ['', [Validators.required]],
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
    private route: Router,
    public dialog: MatDialog
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
      discountMember:
        this.getSettingInfoByName('discountMember').value == ''
          ? 0
          : this.getSettingInfoByName('discountMember').value,
      imageShop: this.downloadURL
        ? this.downloadURL
        : this.getUserData.imageShop,
    };

    this.onOpenDialog('save', userData);
  }

  onUploadImage(event: any) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    console.log(file.type.includes('image'));

    if (file.type.includes('image')) {
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
    } else {
      this.onOpenDialog('error-image-type', '');
    }
  }

  onOpenDialog(condition: string, item: any) {
    this.dialog
      .open(DialogSetting, { data: { condition, item } })
      .afterClosed()
      .subscribe((value) => {
        console.log(value.data);

        switch (value.data.command) {
          case 'confirm-save':
            this.showSpinner = true;
            this.apiService.updateUserData(value.data.item.item).then(() => {
              this.apiService
                .queryUsername(value.data.item.item.username)
                .subscribe((data) => {
                  localStorage.setItem('UData', JSON.stringify(data[0]));
                  this.showSpinner = false;
                  this.route.navigate(['menu']);
                });
            });
            break;
          case 'confirm-logout':
            localStorage.removeItem('UData');
            this.route.navigate(['login']);
            break;
          case 'confirm-delete':
            this.showSpinner = true;
            this.apiService
              .deleteUserData(this.getUserData.username)
              .finally(() => {
                localStorage.removeItem('UData');
                this.route.navigate(['login']);
                this.showSpinner = false;
              });
            break;
        }
      });
  }

  clearImage() {
    this.downloadURL = '';
  }

  onBack() {
    this.route.navigate(['menu']);
  }

  onDeleteDialog() {
    this.onOpenDialog('delete', '');
  }

  onLogout() {
    this.onOpenDialog('logout', '');
  }
}

@Component({
  selector: 'dialog-setting',
  templateUrl: './dialog-setting.html',
  styleUrls: ['./setting.component.scss'],
})
export class DialogSetting {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogSetting>
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.data);
  }

  onCloseDialog(command: string = '') {
    switch (command) {
      default:
        this.dialogRef.close({
          data: { command, item: this.data },
        });
        break;
    }
  }
}
