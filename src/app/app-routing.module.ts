import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UserPageComponent } from './shared/user-page/user-page.component';

const routes: Routes = [

  { path: 'auth', component: AuthComponent }, 
  { path: 'user', component: UserPageComponent },  
  { path: '', redirectTo: '/user', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/user' } 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
