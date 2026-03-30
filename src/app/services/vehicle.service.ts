import { Injectable, computed, signal } from '@angular/core';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly vehiclesData: Vehicle[] = [
    {
      id: 1,
      marca: 'Toyota',
      modelo: 'Corolla Cross XEi',
      year: 2022,
      km: '32.000',
      precio: '$28.500.000',
      image: 'assets/images/car1.png',
      combustible: 'Nafta',
      transmision: 'Automática',
      destacado: true
    },
    {
      id: 2,
      marca: 'Volkswagen',
      modelo: 'Tiguan Allspace',
      year: 2021,
      km: '48.000',
      precio: '$35.800.000',
      image: 'assets/images/car2.png',
      combustible: 'Nafta',
      transmision: 'Automática',
      destacado: true
    },
    {
      id: 3,
      marca: 'Ford',
      modelo: 'Ranger XLT 4x4',
      year: 2023,
      km: '18.500',
      precio: '$42.000.000',
      image: 'assets/images/car3.png',
      combustible: 'Diesel',
      transmision: 'Manual',
      destacado: false
    },
    {
      id: 4,
      marca: 'Chevrolet',
      modelo: 'Onix Plus LTZ',
      year: 2022,
      km: '25.000',
      precio: '$16.200.000',
      image: 'assets/images/car1.png',
      combustible: 'Nafta',
      transmision: 'Automática',
      destacado: true
    },
    {
      id: 5,
      marca: 'Renault',
      modelo: 'Duster Oroch',
      year: 2021,
      km: '55.000',
      precio: '$21.500.000',
      image: 'assets/images/car3.png',
      combustible: 'Nafta',
      transmision: 'Manual',
      destacado: false
    },
    {
      id: 6,
      marca: 'Peugeot',
      modelo: '208 GT Line',
      year: 2023,
      km: '12.000',
      precio: '$18.900.000',
      image: 'assets/images/car2.png',
      combustible: 'Nafta',
      transmision: 'Automática',
      destacado: false
    }
  ];

  // We expose standard methods or Signals. Let's use computed signals.
  private vehiclesSignal = signal<Vehicle[]>(this.vehiclesData);
  
  public allVehicles = computed(() => this.vehiclesSignal());
  
  public featuredVehicles = computed(() => 
    this.vehiclesSignal().filter(v => v.destacado).slice(0, 3)
  );

  constructor() {}
}
