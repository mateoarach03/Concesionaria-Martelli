import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vehiculos.html',
  styleUrl: './vehiculos.css'
})
export class VehiculosComponent {
  private vehicleService = inject(VehicleService);
  
  readonly whatsappNumber = '543412718312';

  // ── Filtros ──────────────────────────────────────────────
  searchText = '';
  filtroMarca = '';
  filtroModelo = '';
  filtroTransmision = '';

  // Opciones únicas generadas dinámicamente desde los datos
  get marcasDisponibles(): string[] {
    const vehiculos = this.vehicleService.allVehicles();
    return [...new Set(vehiculos.map(v => v.marca).filter(m => !!m))].sort();
  }

  get modelosDisponibles(): string[] {
    const vehiculos = this.vehicleService.allVehicles();
    const base = this.filtroMarca
      ? vehiculos.filter(v => v.marca === this.filtroMarca)
      : vehiculos;
    return [...new Set(base.map(v => v.modelo).filter(m => !!m))].sort();
  }

  get transmisionesDisponibles(): string[] {
    const vehiculos = this.vehicleService.allVehicles();
    return [...new Set(vehiculos.map(v => v.transmision).filter(t => !!t))].sort() as string[];
  }

  // Listado filtrado
  get vehiculosFiltrados(): Vehicle[] {
    const vehiculos = this.vehicleService.allVehicles();
    const txt = this.searchText.toLowerCase().trim();

    return vehiculos.filter(v => {
      const matchTexto = !txt || [v.marca, v.modelo, v.combustible, v.transmision, String(v.year)]
        .filter((campo): campo is string => !!campo)
        .some(campo => campo.toLowerCase().includes(txt));

      const matchMarca = !this.filtroMarca || v.marca === this.filtroMarca;
      const matchModelo = !this.filtroModelo || v.modelo === this.filtroModelo;
      const matchTransmision = !this.filtroTransmision || v.transmision === this.filtroTransmision;

      return matchTexto && matchMarca && matchModelo && matchTransmision;
    });
  }

  get hayFiltrosActivos(): boolean {
    return !!(this.searchText || this.filtroMarca || this.filtroModelo || this.filtroTransmision);
  }

  // Al cambiar la marca, resetear el modelo (puede dejar de ser válido)
  onMarcaChange() {
    this.filtroModelo = '';
  }

  limpiarFiltros() {
    this.searchText = '';
    this.filtroMarca = '';
    this.filtroModelo = '';
    this.filtroTransmision = '';
  }

  getWhatsappUrl(vehiculo: Vehicle): string {
    const msg = encodeURIComponent(`Hola! Me interesa el ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.year}. ¿Está disponible?`);
    return `https://wa.me/${this.whatsappNumber}?text=${msg}`;
  }
}
