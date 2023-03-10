import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'c-input',
  templateUrl: './c-input.component.html',
  styleUrls: ['./c-input.component.scss'],
})
export class CInputComponent implements OnInit {
  @Input() control: FormControl = new FormControl('');
  @Input() label!: string;
  @Input() id!: string;
  @Input() placeholder = '';
  @Input() inputType!: string;
  @Input() required!: boolean;
  @Input() maxlength!: number;
  @Input() minlength!: number;
  @Input() onlyNumber!: boolean;
  @Input() mask!: string;

  constructor() {}

  ngOnInit(): void {}
}
