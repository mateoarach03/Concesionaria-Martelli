import { Injectable, computed, signal } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private supabase: SupabaseClient;

  // Signals para estado reactivo
  private vehiclesSignal = signal<Vehicle[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  public allVehicles = computed(() => this.vehiclesSignal());
  public featuredVehicles = computed(() =>
    this.vehiclesSignal().filter(v => v.destacado).slice(0, 3)
  );
  public isLoading = computed(() => this.loadingSignal());
  public error = computed(() => this.errorSignal());

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.loadVehiclesFromSupabase();
  }

  // Cargar vehículos desde Supabase
  private async loadVehiclesFromSupabase() {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);

      const { data, error } = await this.supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading from Supabase:', error);
        this.errorSignal.set('Error al cargar vehículos desde la base de datos');
        this.vehiclesSignal.set([]);
      } else {
        // Normalizar datos: asegurar que 'image' tenga la primera URL del arreglo 'images'
        const normalized = (data ?? []).map((v: any) => ({
          ...v,
          image: v.images && v.images.length > 0 ? v.images[0] : (v.image || v.imagen_url || null)
        }));
        this.vehiclesSignal.set(normalized as Vehicle[]);
      }
    } catch (err: any) {
      console.error('Error loading vehicles:', err);
      this.errorSignal.set('Error al cargar vehículos');
      this.vehiclesSignal.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Obtener vehículo por ID (todos los IDs son UUIDs string desde Supabase)
  public getVehicleById(id: number | string): Vehicle | undefined {
    return this.vehiclesSignal().find(v => String(v.id) === String(id));
  }

  // Crear vehículo (solo admin)
  async createVehicle(vehicle: Partial<Vehicle>, adminId: string): Promise<{ data: Vehicle | null; error: any }> {
    try {
      this.loadingSignal.set(true);

      const { data, error } = await this.supabase
        .from('vehicles')
        .insert({
          marca: vehicle.marca,
          modelo: vehicle.modelo,
          year: vehicle.year,
          precio: vehicle.precio,
          descripcion: vehicle.descripcion,
          images: vehicle.images || (vehicle.image ? [vehicle.image] : []),
          stock: vehicle.stock || 1,
          km: vehicle.km || null,
          combustible: vehicle.combustible || null,
          transmision: vehicle.transmision || null,
          destacado: vehicle.destacado || false,
          created_by: adminId
        })
        .select()
        .single();

      if (error) throw error;

      // Actualizar signal
      const current = this.vehiclesSignal();
      this.vehiclesSignal.set([data as Vehicle, ...current]);

      return { data: data as Vehicle, error: null };
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al crear vehículo';
      this.errorSignal.set(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Actualizar vehículo (solo admin)
  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<{ data: Vehicle | null; error: any }> {
    try {
      this.loadingSignal.set(true);

      const updatePayload: any = {};
      if (updates.marca) updatePayload.marca = updates.marca;
      if (updates.modelo) updatePayload.modelo = updates.modelo;
      if (updates.year) updatePayload.year = updates.year;
      if (updates.precio) updatePayload.precio = updates.precio;
      if (updates.descripcion !== undefined) updatePayload.descripcion = updates.descripcion;
      if (updates.images) updatePayload.images = updates.images;
      else if (updates.image) updatePayload.images = [updates.image];
      if (updates.stock !== undefined) updatePayload.stock = updates.stock;
      if (updates.km !== undefined) updatePayload.km = updates.km || null;
      if (updates.combustible !== undefined) updatePayload.combustible = updates.combustible || null;
      if (updates.transmision !== undefined) updatePayload.transmision = updates.transmision || null;
      if (updates.destacado !== undefined) updatePayload.destacado = updates.destacado;
      updatePayload.updated_at = new Date().toISOString();

      const { data, error } = await this.supabase
        .from('vehicles')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Actualizar signal
      const current = this.vehiclesSignal();
      const updated = current.map(v => v.id === id ? (data as Vehicle) : v);
      this.vehiclesSignal.set(updated);

      return { data: data as Vehicle, error: null };
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al actualizar vehículo';
      this.errorSignal.set(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Eliminar vehículo (solo admin)
  async deleteVehicle(id: string): Promise<{ error: any }> {
    try {
      this.loadingSignal.set(true);

      const { error } = await this.supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar signal
      const current = this.vehiclesSignal();
      this.vehiclesSignal.set(current.filter(v => v.id !== id));

      return { error: null };
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al eliminar vehículo';
      this.errorSignal.set(errorMsg);
      return { error: errorMsg };
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Recargar vehículos
  async refreshVehicles(): Promise<void> {
    await this.loadVehiclesFromSupabase();
  }

  // Subir imagen a Supabase Storage
  async uploadImage(file: File): Promise<{ url: string | null; error: any }> {
    try {
      this.loadingSignal.set(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await this.supabase
        .storage
        .from('vehicles') 
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Generar URL pública
      const { data: publicUrlData } = this.supabase
        .storage
        .from('vehicles')
        .getPublicUrl(filePath);

      return { url: publicUrlData.publicUrl, error: null };
    } catch (err: any) {
      const errorMsg = err?.message || 'Error al subir la imagen';
      this.errorSignal.set(errorMsg);
      return { url: null, error: errorMsg };
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
