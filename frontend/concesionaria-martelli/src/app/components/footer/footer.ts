import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
  readonly whatsappNumber = '5491112345678';
  readonly instagramUser = 'martelliautomotores';
  readonly googleMapsUrl = 'https://www.google.com/maps/search/concesionaria+autos/@-34.6037,58.3816,17z';

  get whatsappUrl(): string {
    return `https://wa.me/${this.whatsappNumber}`;
  }

  get instagramUrl(): string {
    return `https://instagram.com/${this.instagramUser}`;
  }


}
