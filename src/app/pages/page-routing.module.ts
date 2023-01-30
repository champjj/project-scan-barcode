import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { SellProductComponent } from './sell-product/sell-product.component';
import { StockComponent } from './stock/stock.component';
import { SettingComponent } from './setting/setting.component';
import { RegisterComponent } from './register/register.component';
import { EditSelectProductComponent } from './edit-product/edit-select-product/edit-select-product.component';

const routes: Routes = [
  // { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'edit-product', component: EditProductComponent },
  { path: 'edit-select/:code', component: EditSelectProductComponent },
  { path: 'sell-product', component: SellProductComponent },
  { path: 'stock', component: StockComponent },
  { path: 'setting', component: SettingComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class PageRoutingModule {}
