export interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  year: number;
  km: string;
  precio: string;
  image: string;
  images?: string[];
  descripcion?: string;
  combustible: string;
  transmision: string;
  destacado?: boolean;
}
