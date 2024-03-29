import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Banco } from "src/app/models/banco.entity";
import { Cliente } from "src/app/models/cliente.entity";
import { Cuota } from "src/app/models/cuota.entity";
import { CuotaPrestador } from "src/app/models/cuotaPrestador.entity";
import { Inversion } from "src/app/models/inversion.entity";
import { Inversionista } from "src/app/models/inversionista.entity";
import { Prestamo } from "src/app/models/prestamo.entity";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InversionistaService {
  urlBase = environment.serverurl;

  constructor(private http: HttpClient) {}

  getInversionistatList(): Observable<Inversionista[]> {
    return this.http.get<any>(this.urlBase + "cliente/inversionista/");
  }

  getInversionistaById(id: string): Observable<Inversionista> {
    return this.http.get<any>(
      this.urlBase + "cliente/inversionista/" + id + "/"
    );
  }

  createInversionista(inversionista: Inversionista): Observable<Inversionista> {
    return this.http.post<Inversionista>(
      this.urlBase + "cliente/inversionista/",
      inversionista
    );
  }

  createInversion(id: string, inversion: Inversion): Observable<any> {

    return this.http.post<Inversionista>(
      this.urlBase + "cuota/" + id + "/inversiones/",
      inversion
    );
  }

  updateStatusCuota(
    cuota: CuotaPrestador,
    bank_id: string,
    transaction_date: string
  ): Observable<any> {
    return this.http.patch<any>(
      this.urlBase + "cuota/" + cuota.id + "/update-status/" + bank_id + "/",
      { status: cuota.status, transaction_date: transaction_date }
    );
  }

  getCuotasInversionistas(): Observable<any> {
    return this.http.get<any>(this.urlBase + "cuota/cuotas_inversionista/");
  }

  getCuotasClientes(): Observable<any> {
    return this.http.get<any>(this.urlBase + "cuota/cuotas_cliente/");
  }

  precancelarCuotas(id: string): Observable<any> {
    return this.http.post<Inversionista>(
      this.urlBase + "cuota/precancelar_cuotas/" + id + "/",
      {}
    );
  }

  getClientetList(): Observable<Cliente[]> {
    return this.http.get<any>(this.urlBase + "cliente/prestador/");
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(
      this.urlBase + "cliente/prestador/",
      cliente
    );
  }

  getClienteById(id: string): Observable<Cliente> {
    return this.http.get<any>(this.urlBase + "cliente/prestador/" + id + "/");
  }

  createPrestamo(id: string, prestamo: Prestamo): Observable<any> {
    return this.http.post<Cliente>(
      this.urlBase + "cuota/" + id + "/prestamos/",
      prestamo
    );
  }

  actualizarFechaPrestamo(prestamoId: string, nuevaFecha: string): Observable<any> {
    const url = `${this.urlBase}cuota/prestamos/actualizar/${prestamoId}/`;
    return this.http.post(url, { nueva_fecha_prestamo: nuevaFecha });
  }

  actualizarFechaInversion(prestamoId: string, nuevaFecha: string): Observable<any> {
    const url = `${this.urlBase}cuota/inversiones/actualizar/${prestamoId}/`;
    return this.http.post(url, { nueva_fecha_inversion: nuevaFecha });
  }
  

  updateStatusCuotaPrestador(
    cuota: CuotaPrestador,
    bank_id: string,
    transaction_date: string
  ): Observable<any> {
    return this.http.patch<any>(
      this.urlBase +
        "cuota/cuota_prestador/" +
        cuota.id +
        "/update-status/" +
        bank_id +
        "/",
      { status: cuota.status, transaction_date: transaction_date }
    );
  }

  getBancoList(): Observable<Banco[]> {
    return this.http.get<any>(this.urlBase + "cuota/banco/");
  }

  transferir(
    bancoOrigen: string,
    bancoDestino: string,
    cantidad: string,
    transaction_date: string
  ): Observable<any> {
    return this.http.post<Cliente>(this.urlBase + "cuota/transfer_money/", {
      from_bank_id: bancoOrigen,
      to_bank_id: bancoDestino,
      amount: cantidad,
      transaction_date: transaction_date,
    });
  }

  notaDebito(
    bancoDestino: string,
    cantidad: string,
    descripcion: string,
    transaction_date: string
  ): Observable<any> {
    return this.http.post<Cliente>(this.urlBase + "cuota/nota_debito/", {
      to_bank_id: bancoDestino,
      amount: cantidad,
      descripcion: descripcion,
      transaction_date: transaction_date,
    });
  }

  notaCredito(
    bancoDestino: string,
    cantidad: string,
    descripcion: string,
    transaction_date: string
  ): Observable<any> {
    return this.http.post<Cliente>(this.urlBase + "cuota/nota_credito/", {
      to_bank_id: bancoDestino,
      amount: cantidad,
      descripcion: descripcion,
      transaction_date: transaction_date,
    });
  }

  retirarDineroInversion(
    withdraw_amount: number,
    inversion_id: string
  ): Observable<any> {
    return this.http.put<any>(
      this.urlBase + "cuota/inversion/" + inversion_id + "/update_capital/",
      { withdraw_amount: withdraw_amount }
    );
  }

  getTransacciones(): Observable<any[]> {
    return this.http.get<any>(this.urlBase + "cuota/transacciones/");
  }
}
