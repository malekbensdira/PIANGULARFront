import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';  
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
//import { UserPageComponent } from './shared/user-page/user-page.component';
//import { HeaderBeforeSigninComponent } from './shared/header-before-signin/header-before-signin.component';
//import { HeaderAfterSigninComponent } from './shared/header-after-signin/header-after-signin.component';
//import { FooterComponent } from './shared/footer/footer.component';
import { CreditModule } from './credit/credit.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  //  HeaderBeforeSigninComponent,
    AuthComponent,
   // UserPageComponent,
   //HeaderAfterSigninComponent,
    //FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CreditModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }