import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CInputComponent } from './c-input/c-input.component';

///// material
import { MatInputModule } from '@angular/material/input';

const COMPONENT = [CInputComponent];
const MODULES = [ReactiveFormsModule, FormsModule, MatInputModule];

@NgModule({
  declarations: [...COMPONENT],
  imports: [CommonModule, ...MODULES],
  exports: [...COMPONENT, ...MODULES],
})
export class ComponentModule {}
