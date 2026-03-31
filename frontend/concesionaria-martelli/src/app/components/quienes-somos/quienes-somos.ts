import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quienes-somos.html',
  styleUrl: './quienes-somos.css'
})
export class QuienesSomosComponent implements OnInit, OnDestroy {
  readonly whatsappNumber = '5491112345678';
  readonly googleMapsUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016!2d-58.3816!3d-34.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzEzLjMiUyA1OMKwMjInNTMuOCJX!5e0!3m2!1ses!2sar!4v1234567890';

  slideImages: string[] = [
    'assets/images/slide1.png',
    'assets/images/slide2.png',
    'assets/images/slide3.png'
  ];
  currentSlide = 0;
  private autoSlideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slideImages.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slideImages.length) % this.slideImages.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  readonly valores = [
    {
      icon: 'fas fa-handshake',
      titulo: 'Confianza',
      texto: 'Más de 18 años construyendo relaciones basadas en la honestidad y la transparencia con nuestros clientes.'
    },
    {
      icon: 'fas fa-shield-alt',
      titulo: 'Garantía',
      texto: 'Todos nuestros vehículos cuentan con revisión técnica completa y documentación en regla.'
    },
    {
      icon: 'fas fa-sync-alt',
      titulo: 'Permutas',
      texto: 'Aceptamos tu vehículo como parte de pago. Valuación justa y proceso ágil.'
    },
    {
      icon: 'fas fa-credit-card',
      titulo: 'Financiación',
      texto: 'Planes de financiación adaptados a tu situación. Cuotas accesibles y trámites simples.'
    }
  ];

  getWhatsappUrl(): string {
    return `https://wa.me/${this.whatsappNumber}?text=Hola!%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Martelli%20Automotores.`;
  }
}
