import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';

import { CreditPredictionComponent } from './credit-prediction/credit-prediction.component';
import { ContractManagementComponent } from './contract-management/contract-management.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SharedModule } from '../shared/shared.module';
//import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes = [
  { path: 'admin', component: AdminDashboardComponent },
 // { path: 'admin/users', component: UserManagementComponent },
  { path: 'admin/prediction', component: CreditPredictionComponent },
  { path: 'admin/contracts', component: ContractManagementComponent },
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
  //  UserManagementComponent,
    CreditPredictionComponent,
    ContractManagementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class AdminModule { }