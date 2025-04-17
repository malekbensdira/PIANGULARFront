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

@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    EditComponent,
    DetailComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [ImmobilierService],
  bootstrap: [AppComponent]
})
export class AppModule { }