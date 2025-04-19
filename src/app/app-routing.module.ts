import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { AuthComponent } from './auth/auth.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetEmailComponent } from './reset-email/reset-email.component';  // Ajoutez cette ligne
import { ResetSmsComponent } from './reset-sms/reset-sms.component';
import { ResetSmsFormulaireComponent } from './reset-sms-formulaire/reset-sms-formulaire.component'; // Assurez-vous d'importer le composant
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';

const routes: Routes = [
  { path: 'add-user', component: AddUserComponent },
  { path: 'reset-sms', component: ResetSmsComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-sms-formulaire', component: ResetSmsFormulaireComponent }, // Nouvelle route ajoutée
  { path: 'profile-settings', component: ProfileSettingsComponent },

  { path: 'auth', component: AuthComponent },
  { path: 'admin', component: AdminPageComponent },  
  { path: 'user', component: UserPageComponent },  
  { path: '', redirectTo: '/user', pathMatch: 'full' }, 
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-email', component: ResetEmailComponent },
  { path: '**', redirectTo: '/user' } 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
