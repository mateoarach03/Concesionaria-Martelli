export interface Vehicle {
  id?: string | number;
  marca: string;
  modelo: string;
  year?: number;

  km?: string;
  precio: string | number;
  image?: string;
  images?: string[];
  imagen_url?: string;
  descripcion?: string;
  combustible?: string;
  transmision?: string;
  destacado?: boolean;
  stock?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}
