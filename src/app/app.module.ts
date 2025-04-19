import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';  
import { AppComponent } from './app.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderBeforeSigninComponent,
    AddUserComponent,
    ResetSmsFormulaireComponent, // Ajoutez le composant dans les déclarations
    AuthComponent,
    AdminPageComponent,
    UserPageComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ResetEmailComponent,
    ResetSmsComponent,
    ResetSmsFormulaireComponent,
    HeaderBeforeSigninComponent,
    HeaderAfterSigninComponent,
    ProfileSettingsComponent,
    MessengerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    ReactiveFormsModule,
    FormsModule,  // Ajouté ici pour ngModel
    HttpClientModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
