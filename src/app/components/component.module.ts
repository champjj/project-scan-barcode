import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CInputComponent } from './c-input/c-input.component';

///// material
import { MatInputModule } from '@angular/material/input';

import { CScanBarcodeComponent } from './c-scan-barcode/c-scan-barcode.component';
import { DirectiveModule } from '../@core/directives/directive.module';

const COMPONENT = [CInputComponent];
const MODULES = [
  ReactiveFormsModule,
  FormsModule,
  MatInputModule,
  DirectiveModule,
];

@NgModule({
  declarations: [...COMPONENT, CScanBarcodeComponent],
  imports: [CommonModule, ...MODULES],
  exports: [...COMPONENT, ...MODULES],
})
export class ComponentModule {}
