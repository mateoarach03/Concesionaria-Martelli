import { Component, OnInit, OnDestroy, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';

interface Slide {
  id: number;
  image: string;
  title: string;
  titleHighlight: string;
  description: string;
  buttonText: string;
  buttonTarget: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  vehicleService = inject(VehicleService);
  featuredVehicles: Signal<Vehicle[]> = this.vehicleService.featuredVehicles;

  currentSlide = 0;
  private autoSlideInterval: any;
  isTransitioning = false;

  readonly slides: Slide[] = [
    {
      id: 1,
      image: 'assets/images/slide1.png',
      title: 'Tu próximo vehículo',
      titleHighlight: 'está con nosotros',
      description: 'Encontrá el auto usado ideal con garantía de calidad y transparencia en cada compra.',
      buttonText: 'Ver Vehículos',
      buttonTarget: 'vehiculos'
    },
    {
      id: 2,
      image: 'assets/images/slide2.png',
      title: 'La mejor financiación',
      titleHighlight: 'y permutas',
      description: 'Opciones flexibles adaptadas a tus necesidades. Consultá sin compromiso.',
      buttonText: 'Consultar',
      buttonTarget: 'quienes-somos'
    },
  ];

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  goToSlide(index: number) {
    if (this.isTransitioning || index === this.currentSlide) return;
    this.isTransitioning = true;
    this.currentSlide = index;
    this.stopAutoSlide();
    this.startAutoSlide();
    setTimeout(() => {
      this.isTransitioning = false;
    }, 600);
  }

  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(next);
  }

  prevSlide() {
    const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prev);
  }

  getWhatsappUrl(vehiculo: Vehicle): string {
    const whatsappNumber = '543412718312';
    const msg = encodeURIComponent(`Hola! Me interesa el ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.year}. ¿Está disponible?`);
    return `https://wa.me/${whatsappNumber}?text=${msg}`;
  }
}
