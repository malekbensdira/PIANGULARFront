import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule ,ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AddComponent } from './components/immobiliers/add/add.component';
import { EditComponent } from './components/immobiliers/edit/edit.component';
import { DetailComponent } from './components/immobiliers/detail/detail.component';
import { ListComponent } from './components/immobiliers/list/list.component';
import { ImmobilierService } from './services/immobilier.service'; 
import { EstimateComponent } from './components/immobiliers/estimate/estimate.component';
import { PaymentComponent } from './components/immobiliers/payment/payment.component';
import { FooterComponent } from "./components/immobiliers/footer/footer.component";
import { HeaderComponent } from './components/immobiliers/header/header-after-signin.component';
import { SafeUrlPipe } from "../shared/pipes/safe-url.pipe";
import { AdminListComponent } from './components/immobiliers/admin-list/admin-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    EditComponent,
    DetailComponent,
    EstimateComponent,
    ListComponent,
    PaymentComponent,
    FooterComponent,
    HeaderComponent,
    AdminListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SafeUrlPipe
],
  providers: [ImmobilierService],
  bootstrap: [AppComponent]
})
export class AppModule { }