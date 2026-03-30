import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Vehicle } from '../../models/vehicle';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehiculo-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vehiculo-detalle.html',
  styleUrls: ['./vehiculo-detalle.css']
})
export class VehiculoDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);

  public vehicle: Vehicle | undefined;
  public mainImage: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        // En Supabase el ID es un UUID (string), en el mock puede ser number
        this.vehicle = this.vehicleService.getVehicleById(idParam);
        if (this.vehicle) {
          this.mainImage = this.vehicle.image || (this.vehicle.images && this.vehicle.images.length > 0 ? this.vehicle.images[0] : '');
        }
      }
    });
  }

  public setMainImage(img: string): void {
    this.mainImage = img;
  }

  public getWhatsappUrl(): string {
    if (!this.vehicle) return '#';
    const num = '5491100000000'; // Placeholder WhatsApp number
    const msg = `Hola, estoy interesado en el ${this.vehicle.marca} ${this.vehicle.modelo} del ${this.vehicle.year}.`;
    return `https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(msg)}`;
  }
}
