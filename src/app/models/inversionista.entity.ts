import { Cuota } from "./cuota.entity";
import { Inversion } from "./inversion.entity";

export interface Inversionista {
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
  total_invertido: any;
  porcentaje_pagado: any;
  inversiones: Inversion[]

}
