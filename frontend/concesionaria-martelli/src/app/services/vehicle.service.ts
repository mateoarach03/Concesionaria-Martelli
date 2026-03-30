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
      images: ['assets/images/car1.png', 'assets/images/car2.png', 'assets/images/car3.png'],
      descripcion: 'Excelente estado, service oficial al día. Motor 2.0 con 170 CV, caja automática CVT. Tapizado de cuero, pantalla táctil, climatizador bi-zona. Ideal para toda la familia.',
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
      images: ['assets/images/car2.png', 'assets/images/car1.png', 'assets/images/car3.png'],
      descripcion: 'Primera mano. Tercera fila de asientos, techo panorámico corredizo, tablero digital Active Info Display, sensores de estacionamiento y cámara de retroceso.',
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
      images: ['assets/images/car3.png', 'assets/images/car1.png', 'assets/images/car2.png'],
      descripcion: 'Versión XLT 4x4, muy equipada. Levanta vidrios en las 4 puertas, espejos eléctricos, llantas de aleación, computadora de abordo, velocidad crucero.',
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
      images: ['assets/images/car1.png', 'assets/images/car2.png'],
      descripcion: 'Onix Plus Sedan LTZ. Gran capacidad de baúl. Muy bajo consumo, ideal para la ciudad. Cuenta con pantalla táctil con conectividad Android Auto y Apple CarPlay.',
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
      images: ['assets/images/car3.png', 'assets/images/car1.png'],
      descripcion: 'Duster Oroch versión Dynamique. Única dueña, excelente cuidado. Neumáticos nuevos. Lista para transferir.',
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
      images: ['assets/images/car2.png', 'assets/images/car3.png'],
      descripcion: 'Impecable, igual a 0km. Pack deportivo GT Line, techo cielo, luces full LED, i-Cockpit 3D. Oportunidad por su estado.',
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

  public getVehicleById(id: number): Vehicle | undefined {
    return this.vehiclesData.find(v => v.id === id);
  }
}
