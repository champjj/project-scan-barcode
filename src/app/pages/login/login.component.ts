import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private apiService: ApiServiceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  disabledButton() {
    return this.loginForm.invalid;
  }

  getLoginFormByName(name: string) {
    return this.loginForm.get(name) as FormControl;
  }

  onLogin() {
    const { username, password } = this.loginForm.value;

    this.apiService
      .queryUsername(username)
      .pipe(
        tap((userData: any) => {
          console.log(userData[0]);
          if (userData[0]) {
            if (userData[0].password == password) {
              this.route.navigate(['menu']);
            } else {
              this.openDialog();
            }
          }
        })
      )
      .subscribe();
  }

  onRegister() {
    this.route.navigate(['register']);
  }

  openDialog(): void {
    this.dialog.open(DialogLogin, {});
  }
}

@Component({
  selector: 'dialog-login',
  templateUrl: './dialog-login.html',
  styleUrls: ['./login.component.scss'],
})
export class DialogLogin {}
