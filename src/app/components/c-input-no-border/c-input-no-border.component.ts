import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'c-input-no-border',
  templateUrl: './c-input-no-border.component.html',
  styleUrls: ['./c-input-no-border.component.scss'],
})
export class CInputNoBorderComponent implements OnInit {
  @Input() control: FormControl = new FormControl('');
  @Input() label!: string;
  @Input() id!: string;
  @Input() placeholder = '';
  @Input() inputType!: string;
  @Input() required!: boolean;
  @Input() maxlength!: number;
  @Input() minlength!: number;
  @Input() onlyNumber!: boolean;
  @Input() hiddenInput!: boolean;
  @Input() mask!: string;

  constructor() {}

  ngOnInit(): void {}
}
