import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UserPageComponent } from './shared/user-page/user-page.component';
import { InsuranceManagerComponent } from './insurance-manager/insurance-manager.component';
import { ClassificationComponent } from './classification/classification.component';
import { PredictClaimComponent } from './predict-claim/predict-claim.component';
import { SubscribeInsuranceComponent } from './subscribe-insurance/subscribe-insurance.component';

const routes: Routes = [

  { path: 'auth', component: AuthComponent },
  { path: 'user', component: UserPageComponent },
  { path: 'insurance-manager', component: InsuranceManagerComponent },
  { path: 'classification', component: ClassificationComponent },
  { path: 'predict-claim', component: PredictClaimComponent },
  { path: 'subscribe', component: SubscribeInsuranceComponent },
  { path: '', redirectTo: '/user', pathMatch: 'full' },
  { path: '**', redirectTo: '/user' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }