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

import { SellProductComponent } from './sell-product/sell-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import {
  DialogEditProduct,
  EditProductComponent,
} from './edit-product/edit-product.component';
import { StockComponent } from './stock/stock.component';
import { SettingComponent } from './setting/setting.component';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import {
  DialogRegister,
  RegisterComponent,
} from './register/register.component';

@NgModule({
  declarations: [
    LoginComponent,
    MenuComponent,
    SellProductComponent,
    AddProductComponent,
    EditProductComponent,
    StockComponent,
    SettingComponent,
    DialogEditProduct,
    RegisterComponent,
    DialogRegister,
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
  ],
  providers: [],
})
export class PageModule {}
