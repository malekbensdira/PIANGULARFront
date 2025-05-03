import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UserPageComponent } from './shared/user-page/user-page.component';
import { CreditListComponent } from './credit/credit-list/credit-list.component';
import { CreditFormComponent } from './credit/credit-form/credit-form.component';
import { CreditDetailComponent } from './credit/credit-detail/credit-detail.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  // Auth routes
  { path: 'auth', component: AuthComponent }, 
  { path: 'user', component: UserPageComponent },
  
  // Credit routes
  { path: 'credit', component: CreditListComponent },
  { path: 'credit/new', component: CreditFormComponent },
  { path: 'credit/:id', component: CreditDetailComponent },
  { path: 'credit/edit/:id', component: CreditFormComponent },

   // Admin routes
   { path: 'admin', component: AdminDashboardComponent },
   { path: 'admin/users', component: UserPageComponent },
   { path: 'admin/prediction', component: CreditListComponent },
  // { path: 'admin/contracts', component: ContractManagementComponent },
  
  // Default routes
  { path: '', redirectTo: '/user', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/user' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }