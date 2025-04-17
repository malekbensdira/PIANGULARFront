import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  template: `<router-outlet></router-outlet>`,
  standalone: false,
  styleUrl: './app.component.css'
  
})
export class AppComponent {
  title = 'mon-projet-immobilier';
}
