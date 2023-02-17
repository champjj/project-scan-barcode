import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { IUser } from 'src/app/@core/models/users-models';
import { ApiServiceService } from 'src/app/@core/services/api-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  getUserDataLogin = localStorage.getItem('UData');

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loadingLogin = false;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private apiService: ApiServiceService,
    public dialog: MatDialog
  ) {
    document.body.style.backgroundColor = '#f3f3f3;';
  }

  ngOnInit(): void {
    this.bypassLogin();
  }

  disabledButton() {
    return this.loginForm.invalid || this.loadingLogin;
  }

  getLoginFormByName(name: string) {
    return this.loginForm.get(name) as FormControl;
  }

  bypassLogin() {
    if (this.getUserDataLogin) {
      this.route.navigate(['menu']);
    }
  }

  onLogin() {
    const { username, password } = this.loginForm.value;
    this.loadingLogin = true;
    this.apiService
      .queryUsername(username)
      .pipe(
        tap((userData: any) => {
          console.log(userData[0]);
          if (userData[0]) {
            if (userData[0].password == password) {
              this.route.navigate(['menu']);
              localStorage.setItem('UData', JSON.stringify(userData[0]));
            } else {
              this.openDialog('wrong-password');
            }
          } else {
            this.openDialog('no-user');
          }
        })
      )
      .subscribe(() => (this.loadingLogin = false));
  }

  onRegister() {
    this.route.navigate(['register']);
  }

  openDialog(condition: string): void {
    this.dialog.open(DialogLogin, { data: condition });
  }
}

@Component({
  selector: 'dialog-login',
  templateUrl: './dialog-login.html',
  styleUrls: ['./login.component.scss'],
})
export class DialogLogin {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogLogin>
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }
}
