import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './pages/events/events.component';
import { PartnersComponent } from './pages/partners/partners.component';
import { AddeventComponent } from './pages/addevent/addevent.component';
import { UpdateeventComponent } from './pages/updateevent/updateevent.component';
import { AddpartnerComponent } from './pages/addpartner/addpartner.component';
import { UpdatepartnerComponent } from './pages/updatepartner/updatepartner.component';
import { ItemsComponent } from './pages/items/items.component';
import { AdditemComponent } from './pages/additem/additem.component';
import { UpdateitemComponent } from './pages/updateitem/updateitem.component';



@NgModule({
  declarations: [
    EventsComponent,
    PartnersComponent,
    AddeventComponent,
    UpdateeventComponent,
    AddpartnerComponent,
    UpdatepartnerComponent,
    ItemsComponent,
    AdditemComponent,
    UpdateitemComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DonationsBoModule { }
