import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
goBack() {
throw new Error('Method not implemented.');
}
  property: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.property = history.state.propertyData;
    if (!this.property) {
      this.router.navigate(['/list']); // Redirige si aucune donnée
    }
  }

  processPayment(): void {
    // Ici vous implémenteriez la logique de paiement réelle
    alert(`Paiement de ${this.property.price}€ pour ${this.property.title} effectué!`);
    this.router.navigate(['/list']);
  }
}
