import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: any[] = [];

  constructor(private router: Router, private eventsService: EventsService) { }

  ngOnInit(): void {
    this.eventsService.getEventsList().subscribe((data: any[]) => {
      console.log('Events reçus :', data); // 👈 Ajoute cette ligne
      this.events = data;
    }, error => {
      console.error('Erreur lors du chargement des événements', error);
    });
  }

  navigateToPartners(eventId: string) {
    this.router.navigate(['/donations/partners'], {
      queryParams: { eventId: eventId }
    });
  }
}

// events: any[] = []; // ou un type plus précis comme DonationEvent[]

  //ngOnInit(): void {
    // Exemple de données fictives ou appel à un service
   /* events = 
  //this.eventsService.getEventsList()
  [
    { id: 1, title: 'Event 1', description: 'Description for event 1', imageUrl: 'assets/img/event 1.jpg' },
     { id: 2, title: 'Event 2', description: 'Description for event 2', imageUrl: 'assets/img/event 2.jpg' },
     { id: 3, title: 'Event 3', description: 'Description for event 3', imageUrl: 'assets/img/event 3.jpg' }
   ];
  */