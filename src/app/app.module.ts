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
import { InsuranceManagerComponent } from './insurance-manager/insurance-manager.component';
import { ClaimPredictorComponent } from './claim-predictor/claim-predictor.component';
import { ClassificationComponent } from './classification/classification.component';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    AppComponent,
    HeaderBeforeSigninComponent,
    AuthComponent,
    UserPageComponent,
    HeaderBeforeSigninComponent,
    HeaderAfterSigninComponent,
    FooterComponent,
    InsuranceManagerComponent,
    ClaimPredictorComponent,
    ClassificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule, 
    AppRoutingModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
