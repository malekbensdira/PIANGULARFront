import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';  
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
import { UserPageComponent } from './shared/user-page/user-page.component';
import { HeaderBeforeSigninComponent } from './shared/header-before-signin/header-before-signin.component';
import { HeaderAfterSigninComponent } from './shared/header-after-signin/header-after-signin.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderBeforeSigninComponent,
    AuthComponent,
    UserPageComponent,
    HeaderBeforeSigninComponent,
    HeaderAfterSigninComponent,
    FooterComponent
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
