import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UserPageComponent } from './shared/user-page/user-page.component';
import { InsuranceManagerComponent } from './insurance-manager/insurance-manager.component';  // Import the InsuranceManagerComponent
import { ClassificationComponent } from './classification/classification.component';
  
   
const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'user', component: UserPageComponent },
  { path: 'insurance', component: InsuranceManagerComponent },  // Add the route for insurance manager
  { path: '', redirectTo: '/user', pathMatch: 'full' },
  { path: 'classification', component: ClassificationComponent },
  { path: '**', redirectTo: '/user' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
