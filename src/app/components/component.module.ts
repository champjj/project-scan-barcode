import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CInputComponent } from './c-input/c-input.component';

///// material
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CScanBarcodeComponent } from './c-scan-barcode/c-scan-barcode.component';
import { DirectiveModule } from '../@core/directives/directive.module';
import { CSelectComponent } from './c-select/c-select.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CAutoCompleteComponent } from './c-auto-complete/c-auto-complete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
const COMPONENT = [
  CInputComponent,
  CSelectComponent,
  CScanBarcodeComponent,
  CAutoCompleteComponent,
];
const MODULES = [
  ReactiveFormsModule,
  FormsModule,
  MatInputModule,
  MatSelectModule,
  DirectiveModule,
  MatAutocompleteModule,
];

@NgModule({
  declarations: [...COMPONENT],
  imports: [CommonModule, ...MODULES, NgxMaskDirective, NgxMaskPipe],
  exports: [...COMPONENT, ...MODULES],
  providers: [provideNgxMask()],
})
export class ComponentModule {}
