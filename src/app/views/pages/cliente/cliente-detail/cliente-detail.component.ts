import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Banco } from "src/app/models/banco.entity";
import { Cliente } from "src/app/models/cliente.entity";
import { Prestamo } from "src/app/models/prestamo.entity";
import { InversionistaService } from "src/app/services/inversionista/inversionista.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-cliente-detail",
  templateUrl: "./cliente-detail.component.html",
  styleUrls: ["./cliente-detail.component.scss"],
})
export class ClienteDetailComponent implements OnInit {
  cliente: Cliente;
  form: FormGroup;
  bancos: Banco[];
  prestamoSeleccionado: string;
  actualizarFechaForm: FormGroup;

  constructor(
    private inversionistaService: InversionistaService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      monto_prestamo: ["", Validators.required],
      interes_cobrar: ["", Validators.required],
      tiempo_prestamo: ["", Validators.required],
      fecha_prestamo: ["", Validators.required],
      forma_pago: ["", Validators.required],
      banco_id: ["", Validators.required],
    });

    this.actualizarFechaForm = this.fb.group({
      fecha_nueva: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      Swal.fire(
        "No se encontro",
        "No se encontro inversionista con ese Id",
        "error"
      );
    } else {
      this.inversionistaService.getClienteById(id).subscribe({
        next: (data) => {
          this.cliente = data;
        },
      });
    }
    this.inversionistaService.getBancoList().subscribe({
      next: (data) => {
        this.bancos = data;
      },
    });
  }

  updateStatus(cuota: any) {
    let optionsHtml = this.bancos
      .map(
        (banco) =>
          `<option value="${banco.id}">${banco.nombre} | $${banco.balance}</option>`
      )
      .join("");

    Swal.fire({
      title: "Detalles Transacción",
      html: `
      <h4>Total a cobrar: $${cuota.cantidad}</h4>
      </br>
      <form class="from-group">
        <div class="mb-3">
          <label for="selectElement" class="form-label">Banco</label>
          <select id="selectElement" class="form-control">
            <option value="">Seleccionar banco</option>
            ${optionsHtml}
          </select>
        </div>
        <div class="mb-3">
          <label for="transaction_date" class="form-label">Fecha de Transacción</label>
          <input type="date" class="form-control" id="transaction_date" name="transaction_date" />
        </div>
      </form>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      preConfirm: () => {
        const selectElement = document.getElementById(
          "selectElement"
        ) as HTMLSelectElement;
        const selectedBankId = selectElement.value;
        if (!selectedBankId) {
          Swal.showValidationMessage("Por favor selecciona un banco");
          return false;
        }
        const transactionDateInput = document.getElementById(
          "transaction_date"
        ) as HTMLInputElement;
        const transactionDate = transactionDateInput.value;
        if (!transactionDate) {
          Swal.showValidationMessage(
            "Por favor selecciona una fecha de transacción"
          );
          return false;
        }
        return { bank_id: selectedBankId, transaction_date: transactionDate };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Destructure the bank_id and transaction_date from the result
        if (result.isConfirmed && result.value) {
          const { bank_id, transaction_date } = result.value;
          if (!bank_id || !transaction_date) {
            return;
          }
          // Pass both bank_id and transaction_date to the service
          this.inversionistaService
            .updateStatusCuotaPrestador(cuota, bank_id, transaction_date)
            .subscribe({
              next: () => {
                Swal.fire({
                  title: "Actualizado!",
                  text: "Se cambio el estado de la cuota",
                  icon: "success",
                });
              },
            });
        }
      } else {
        // Handle the case when the result is not confirmed
        if (cuota.status === "pagado") {
          cuota.status = "pendiente";
        } else {
          cuota.status = "pagado";
        }
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.createInversion(this.form.value);
    } else {
      this.showFormErrors();
    }
  }

  createInversion(prestamo: Prestamo) {
    var id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      Swal.fire("No se encontro", "No se encontro cliente con ese Id", "error");
    } else {
      this.inversionistaService.createPrestamo(id, prestamo).subscribe({
        next: () => {
          Swal.fire(
            "Prestamo creado",
            "Prestamo creado exitosamente",
            "success"
          ).then((result) => {
            window.location.reload();
          });
        },
      });
    }
  }

  showFormErrors(): void {
    let errorMessage = "";
    for (const key in this.form.controls) {
      if (this.form.controls[key].invalid) {
        errorMessage += `Campo ${key} es inválido.<br>`;
      }
    }

    Swal.fire({
      icon: "error",
      title: "Error en el formulario",
      html: errorMessage,
    });
  }

  onActualizarFechaSubmit(): void {
    if (this.actualizarFechaForm.valid && this.prestamoSeleccionado) {
      const nuevaFecha = this.actualizarFechaForm.get("fecha_nueva")?.value;
      this.inversionistaService
        .actualizarFechaPrestamo(this.prestamoSeleccionado, nuevaFecha)
        .subscribe({
          next: () => {
            Swal.fire(
              "Éxito",
              "La fecha del préstamo ha sido actualizada correctamente.",
              "success"
            ).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
            // Cerrar el modal y recargar los datos
            // Puedes usar una variable auxiliar para cerrar el modal o llamar a una función que lo haga
          },
          error: (error) => {
            Swal.fire(
              "Error",
              "No se pudo actualizar la fecha del préstamo.",
              "error"
            );
          },
        });
    }
  }
}
