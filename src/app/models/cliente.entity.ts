import { Prestamo } from "./prestamo.entity";

export interface Cliente {
  id: string;
  cedula: string;
  ruc: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  email: string;
  fecha_nacimiento: string;
  celular: string;
  direccion: string;
  banco: string;
  numero_cuenta: string;
  tipo_cuenta: string;
  nombre_local: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  puntuacion_buro: string;
  prestamos: Prestamo[]
}
