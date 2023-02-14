import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'c-select',
  templateUrl: './c-select.component.html',
  styleUrls: ['./c-select.component.scss'],
})
export class CSelectComponent implements OnInit {
  @Input() selected: string | FormControl = new FormControl('');
  @Input() control: FormControl = new FormControl('');
  @Input() placeholder: string = '';
  @Input() items!: any[];

  constructor() {}

  ngOnInit(): void {}
}
