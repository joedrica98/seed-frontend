import { Cuota } from './cuota.entity';

export interface Inversion {
  id: string;
  fecha_inversion: string;
  fecha_pago: string;
  tipo_inversion: string;
  capital: string;
  interes_mensual: any;
  meses_inversion: number;
  cuotas: Cuota[];
}
