import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';

import { CreditListComponent } from './credit-list/credit-list.component';
import { CreditFormComponent } from './credit-form/credit-form.component';
import { CreditDetailComponent } from './credit-detail/credit-detail.component';
import { RepaymentChartComponent } from './repayment-chart/repayment-chart.component';
import { CreditDashboardComponent } from './credit-dashboard/credit-dashboard.component';
import { SharedModule } from '../shared/shared.module'; // Import the shared module for header and footer
import { ContractGeneratorComponent } from './contract-generator/contract-generator.component';

const routes: Routes = [
  { path: 'credit', component: CreditDashboardComponent }, // Default to dashboard
  { path: 'credit/list', component: CreditListComponent },
  { path: 'credit/new', component: CreditFormComponent },
  { path: 'credit/edit/:id', component: CreditFormComponent },
  { path: 'credit/:id', component: CreditDetailComponent }

];

@NgModule({
  declarations: [
    CreditListComponent,
    CreditFormComponent,
    CreditDetailComponent,
    RepaymentChartComponent,
    CreditDashboardComponent,
    ContractGeneratorComponent

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
  exports: [
    RouterModule
  ]
})
export class CreditModule { }