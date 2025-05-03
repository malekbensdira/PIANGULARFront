import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { AuthComponent } from './auth/auth.component';
import { UserPageComponent } from './user-page/user-page.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetEmailComponent } from './reset-email/reset-email.component';  // Ajoutez cette ligne
import { ResetSmsComponent } from './reset-sms/reset-sms.component';
import { ResetSmsFormulaireComponent } from './reset-sms-formulaire/reset-sms-formulaire.component'; // Assurez-vous d'importer le composant
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import { ClaimsComponent } from './claims/claims.component';
import { ClaimSectionAdminComponent } from './claim-section-admin/claim-section-admin.component';
import { ProfileSettingsAdminComponent } from 'src/app/profile-settings-admin/profile-settings-admin.component';
const routes: Routes = [
  { path: 'adminProfile-settings', component: ProfileSettingsAdminComponent },
  { path: 'claim-section-admin', component: ClaimSectionAdminComponent },
  { path: 'header-admin', component: HeaderAdminComponent },
  { path: 'claims', component: ClaimsComponent },
  { path: 'admin-page', component: AdminPageComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'reset-sms', component: ResetSmsComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-sms-formulaire', component: ResetSmsFormulaireComponent }, // Nouvelle route ajoutée
  { path: 'profile-settings', component: ProfileSettingsComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'user', component: UserPageComponent },  
  { path: 'users-list', component: UsersListComponent },  
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
