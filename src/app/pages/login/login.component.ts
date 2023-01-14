import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { tap } from 'rxjs';

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

  constructor(private fb: FormBuilder, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.getItem();
  }

  getItem() {
    this.firestore
      .collection('users')
      .valueChanges()
      .subscribe((data) => {
        console.log(data);
      });
  }
  disabledButton() {
    return this.loginForm.invalid;
  }

  getLoginFormByName(name: string) {
    return this.loginForm.get(name) as FormControl;
  }
}
