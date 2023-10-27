import { CuotaPrestador } from './cuotaPrestador.entity';

export interface Prestamo {
  id: string;
  forma_pago: string;
  fecha_prestamo: string;
  monto_prestamo: string;
  interes_cobrar: any;
  tiempo_prestamo: number;
  cuotas: CuotaPrestador[];
}
