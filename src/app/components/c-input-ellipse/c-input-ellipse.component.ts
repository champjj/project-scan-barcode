import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'c-input-ellipse',
  templateUrl: './c-input-ellipse.component.html',
  styleUrls: ['./c-input-ellipse.component.scss'],
})
export class CInputEllipseComponent implements OnInit {
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
