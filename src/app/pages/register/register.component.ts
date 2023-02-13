import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, map, shareReplay, switchMap, tap } from 'rxjs';
import { IUser } from 'src/app/@core/models/users-models';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';
import { ServiceDataDialogService } from './service-data-dialog.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    shopname: ['', Validators.required],
    mobileNumber: ['', Validators.required],
    email: [''],
  });

  onClickBtn = false;

  cacheUserData = 1;

  dialogCount = 0;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private apiService: ApiServiceService,
    public dialog: MatDialog,
    private serviceDataDialog: ServiceDataDialogService
  ) {}

  ngOnInit(): void {}

  disabledButton() {
    return this.registerForm.invalid || this.onClickBtn;
  }

  getRegisterFormByName(name: string) {
    return this.registerForm.get(name) as FormControl;
  }

  onRegister() {
    this.onClickBtn = true;
    if (
      this.getRegisterFormByName('password').value ==
      this.getRegisterFormByName('confirmPassword').value
    ) {
      this.apiService
        .queryUsername(this.getRegisterFormByName('username').value)
        .pipe(
          map((userData) => userData.length),
          tap((data) => {
            console.log(data);
            if (data == 0) {
              this.cacheUserData = data;
              console.log('onRegister true');
              this.addNewUser();
            } else if (this.cacheUserData !== 0) {
              console.log('onRegister false');
              this.openDialog(1);
              this.onClickBtn = false;
            }
          }),
          shareReplay()
        )
        .subscribe();
    } else {
      this.openDialog(4);
      this.onClickBtn = false;
    }
  }

  addNewUser() {
    const userData: IUser = {
      username: this.getRegisterFormByName('username').value,
      password: this.getRegisterFormByName('password').value,
      shopname: this.getRegisterFormByName('shopname').value,
      mobileNumber: this.getRegisterFormByName('mobileNumber').value,
      email: this.getRegisterFormByName('email').value,
      discountMember: 0,
      imageShop: '',
    };
    this.apiService.addNewUser(userData).then(() => {
      this.apiService
        .queryUsername(this.getRegisterFormByName('username').value)
        .pipe(
          map((value) => value.length),
          tap((data) => {
            console.log('addNewUser', data);
            if (data > 0) {
              console.log('checkUpdateDataUser true');
              this.route.navigate(['login']);
              this.openDialog(2);
            } else {
              console.log('checkUpdateDataUser false');
              this.openDialog(3);
              this.onClickBtn = false;
            }
          }),
          shareReplay()
        )
        .subscribe();
    });
  }

  openDialog(caseNumber: number): void {
    if (caseNumber == 2) {
      if (this.dialogCount == 0) {
        this.dialogCount++;
        this.serviceDataDialog.setShowCase(caseNumber);
        this.dialog.open(DialogRegister, {});
      }
    } else {
      this.serviceDataDialog.setShowCase(caseNumber);
      this.dialog.open(DialogRegister, {});
    }
  }

  onBack() {
    this.route.navigate(['login']);
  }
}
@Component({
  selector: 'dialog-register',
  templateUrl: './dialog-register.html',
  styleUrls: ['./register.component.scss'],
})
export class DialogRegister {
  showDialog = this.serviceDataDialog.showCase$;

  constructor(private serviceDataDialog: ServiceDataDialogService) {}
}
