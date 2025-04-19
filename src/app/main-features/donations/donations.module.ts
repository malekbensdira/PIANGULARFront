import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonationsRoutingModule } from './donations-routing.module';
import { EventsComponent } from './pages/events/events.component';
import { PartnersComponent } from './pages/partners/partners.component';
import { ItemsComponent } from './pages/items/items.component';
import { CardComponent } from './pages/card/card.component';


@NgModule({
  declarations: [
    EventsComponent,
    PartnersComponent,
    ItemsComponent,
    CardComponent,
    
  ],
  imports: [
    CommonModule,
    DonationsRoutingModule
    
  ]
})
export class DonationsModule { }
