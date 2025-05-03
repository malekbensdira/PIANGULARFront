import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';  
import { AppComponent } from './app.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
import { UserPageComponent } from './user-page/user-page.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetEmailComponent } from './reset-email/reset-email.component';
import { ResetSmsComponent } from './reset-sms/reset-sms.component';
import { ResetSmsFormulaireComponent } from './reset-sms-formulaire/reset-sms-formulaire.component';
import { HeaderBeforeSigninComponent } from './shared/header-before-signin/header-before-signin.component';
import { HeaderAfterSigninComponent } from './shared/header-after-signin/header-after-signin.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { MessengerComponent } from './messenger/messenger.component';
import { UsersListComponent } from './users-list/users-list.component';
import { CommonModule } from '@angular/common';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { LogoAnimatedComponent } from './logo-animated/logo-animated.component';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import { HeaderUserSectionComponent } from './header-user-section/header-user-section.component';
import { FeedbackStatsModalComponent } from './feedback-stats-modal/feedback-stats-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';   
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ChartsModule } from 'ng2-charts';
import { ClaimsComponent } from './claims/claims.component';
import { ClaimModalComponent } from './claim-modal/claim-modal.component';
import { ClaimSectionAdminComponent } from './claim-section-admin/claim-section-admin.component';
import { ProfileSettingsAdminComponent } from './profile-settings-admin/profile-settings-admin.component';
import { ClaimDisplayModalComponent } from './claim-display-modal/claim-display-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderBeforeSigninComponent,
    AddUserComponent,
    ResetSmsFormulaireComponent,
    AuthComponent,
    UserPageComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ResetEmailComponent,
    ResetSmsComponent,
    ResetSmsFormulaireComponent,
    HeaderBeforeSigninComponent,
    HeaderAfterSigninComponent,
    ProfileSettingsComponent,
    MessengerComponent,
    UsersListComponent,
    AdminPageComponent,
    SidebarAdminComponent,
    LogoAnimatedComponent,
    HeaderAdminComponent,
    HeaderUserSectionComponent,
    FeedbackStatsModalComponent,
    ClaimsComponent,
    ClaimModalComponent,
    ClaimSectionAdminComponent,
    ProfileSettingsAdminComponent,
    ClaimDisplayModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }