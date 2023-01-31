import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRoutingModule } from './page-routing.module';
import { ComponentModule } from '../components/component.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';

///// materail
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { SellProductComponent } from './sell-product/sell-product.component';
import {
  AddProductComponent,
  DialogAddProduct,
} from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { StockComponent } from './stock/stock.component';
import { SettingComponent } from './setting/setting.component';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import {
  DialogRegister,
  RegisterComponent,
} from './register/register.component';
import {
  DialogEditScanner,
  EditSelectProductComponent,
} from './edit-product/edit-select-product/edit-select-product.component';

@NgModule({
  declarations: [
    LoginComponent,
    MenuComponent,
    SellProductComponent,
    AddProductComponent,
    EditProductComponent,
    StockComponent,
    SettingComponent,
    RegisterComponent,
    EditSelectProductComponent,
    ///// dialog
    DialogRegister,
    DialogAddProduct,
    DialogEditScanner,
    //////////
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    ComponentModule,
    ReactiveFormsModule,
    NgxScannerQrcodeModule,
    ///// material
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule,
    //////////
  ],
  providers: [],
})
export class PageModule {}
