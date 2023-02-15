import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'c-auto-complete',
  templateUrl: './c-auto-complete.component.html',
  styleUrls: ['./c-auto-complete.component.scss'],
})
export class CAutoCompleteComponent implements OnInit {
  @Input() control: FormControl = new FormControl('');
  @Input() filteredOptions!: Observable<any[]>;
  @Input() placeholder!: string;
  @Input() inputType: string = 'text';
  @Input() options!: string[];

  constructor() {}

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();

    return this.options?.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
