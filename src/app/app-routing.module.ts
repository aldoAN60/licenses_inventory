import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistryTableComponent } from './registry-table/registry-table.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'inventory-table', component: RegistryTableComponent},
  { path: '', redirectTo: '/inventory-table', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
