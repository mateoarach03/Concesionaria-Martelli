import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMobileMenuOpen = false;

  // Datos de contacto - actualizá con los datos reales
  readonly whatsappNumber = '543412718312'; // Formato: código país + número sin espacios
  readonly instagramUser = 'martelliehijos';
  readonly googleMapsUrl = 'https://maps.app.goo.gl/t9WjMUMQvtJQZCzi6';

  get whatsappUrl(): string {
    return `https://wa.me/${this.whatsappNumber}?text=Hola!%20Me%20interesa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20veh%C3%ADculos.`;
  }

  get instagramUrl(): string {
    return `https://instagram.com/${this.instagramUser}`;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 60;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }



  ngOnInit() { }
  ngOnDestroy() { }
}
