import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  settingInfo = this.fb.group({
    userImage: [''],
    username: ['username'],
    shopName: ['shop name'],
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnInit(): void {}

  getSettingInfoByName(name: string) {
    return this.settingInfo.get(name) as FormControl;
  }

  onSave() {
    this.location.back();
  }

  onBack() {
    this.location.back();
  }
}
