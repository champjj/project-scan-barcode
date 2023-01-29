import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/@core/models/users-models';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';

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
    email: [''],
    discountMember: [''],
    imageShop: [''],
  });

  getUserData = JSON.parse(localStorage.getItem('UData') as string);

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
    this.settingInfo.setValue({
      username: this.getUserData.username,
      password: this.getUserData.password,
      shopname: this.getUserData.shopname,
      mobileNumber: this.getUserData.mobileNumber,
      email: this.getUserData.email,
      discountMember: this.getUserData.discountMember,
      imageShop: this.getUserData.imageShop,
    });
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
      imageShop: this.getSettingInfoByName('imageShop').value,
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

  onBack() {
    this.route.navigate(['menu']);
  }
}
