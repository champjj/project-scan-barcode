import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakepointServiceService } from './breakepoint-service.service';

const importService = [BreakepointServiceService]

@NgModule({
  providers:[...importService],
  declarations: [],
  imports: [CommonModule],
  exports: [],
})
export class ServicesModuleModule {}
