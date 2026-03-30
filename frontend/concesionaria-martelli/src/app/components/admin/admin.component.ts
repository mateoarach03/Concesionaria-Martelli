import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, AuthUser } from '../../services/auth.service';
import { VehicleService } from '../../services/vehicle.service';
import { Router } from '@angular/router';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  private authService = inject(AuthService);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Reactivos del componente
  currentUser = computed(() => this.authService.getCurrentUser());
  vehicles = computed(() => this.vehicleService.allVehicles());
  isLoading = computed(() => this.vehicleService.isLoading());
  error = computed(() => this.vehicleService.error());

  // Modo de formulario
  formMode: 'list' | 'create' | 'edit' = 'list';
  editingId: string | null = null;

  // Formulario
  vehicleForm: FormGroup;

  // Error/Success messages
  successMessage: string = '';
  errorMessage: string = '';

  constructor() {
    this.vehicleForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      descripcion: [''],
      image: [''],
      stock: [1, [Validators.required, Validators.min(0)]],
      km: [''],
      combustible: [''],
      transmision: [''],
      destacado: [false]
    });
  }

  // Mostrar formulario para crear
  showCreateForm() {
    this.formMode = 'create';
    this.vehicleForm.reset({ stock: 1 });
    this.editingId = null;
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Mostrar formulario para editar
  showEditForm(vehicle: Vehicle) {
    this.formMode = 'edit';
    this.editingId = vehicle.id as string;
    this.vehicleForm.patchValue({
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      year: vehicle.year,
      precio: typeof vehicle.precio === 'string'
        ? parseFloat(vehicle.precio.replace(/[^\d.-]/g, ''))
        : vehicle.precio,
      descripcion: vehicle.descripcion || '',
      image: vehicle.images ? vehicle.images.join(', ') : (vehicle.image || vehicle.imagen_url || ''),
      stock: vehicle.stock || 1,
      km: vehicle.km || '',
      combustible: vehicle.combustible || '',
      transmision: vehicle.transmision || '',
      destacado: vehicle.destacado || false
    });
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Cancelar edición
  cancelForm() {
    this.formMode = 'list';
    this.vehicleForm.reset();
    this.editingId = null;
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Enviar formulario (crear o editar)
  async submitForm() {
    if (!this.vehicleForm.valid) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    const user = this.currentUser();
    if (!user) {
      this.errorMessage = 'No estás autenticado';
      return;
    }

    try {
      const formValue = { ...this.vehicleForm.value };
      // Procesar el string de imágenes: separar por coma y limpiar espacios
      if (formValue.image) {
        formValue.images = formValue.image.split(',').map((url: string) => url.trim()).filter((url: string) => url !== '');
      } else {
        formValue.images = [];
      }

      if (this.formMode === 'create') {
        await this.createVehicle(user.id, formValue);
      } else if (this.formMode === 'edit' && this.editingId) {
        await this.updateVehicle(this.editingId, user.id, formValue);
      }
    } catch (err) {
      console.error('Error en envío de formulario:', err);
    }
  }

  // Crear vehículo
  private async createVehicle(adminId: string, vehicleData: any) {
    const { data, error } = await this.vehicleService.createVehicle(
      vehicleData,
      adminId
    );

    if (error) {
      this.errorMessage = error;
    } else {
      this.successMessage = '✓ Vehículo creado exitosamente';
      this.vehicleForm.reset({ stock: 1 });
      setTimeout(() => {
        this.formMode = 'list';
        this.successMessage = '';
      }, 2000);
    }
  }

  // Actualizar vehículo
  private async updateVehicle(id: string, adminId: string, vehicleData: any) {
    const { data, error } = await this.vehicleService.updateVehicle(
      id,
      vehicleData
    );

    if (error) {
      this.errorMessage = error;
    } else {
      this.successMessage = '✓ Vehículo actualizado exitosamente';
      setTimeout(() => {
        this.formMode = 'list';
        this.editingId = null;
        this.successMessage = '';
      }, 2000);
    }
  }

  // Eliminar vehículo
  async deleteVehicle(id: string | number) {
    const confirmed = confirm('¿Está seguro que desea eliminar este vehículo?');
    if (!confirmed) return;

    const { error } = await this.vehicleService.deleteVehicle(id as string);

    if (error) {
      this.errorMessage = error;
    } else {
      this.successMessage = '✓ Vehículo eliminado';
      setTimeout(() => {
        this.successMessage = '';
      }, 2000);
    }
  }

  // Logout
  async logout() {
    const confirmed = confirm('¿Deseas cerrar sesión?');
    if (!confirmed) return;

    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
