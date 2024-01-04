import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Banco } from "src/app/models/banco.entity";
import { InversionistaService } from "src/app/services/inversionista/inversionista.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-gastos-list",
  templateUrl: "./gastos-list.component.html",
  styleUrls: ["./gastos-list.component.scss"],
})
export class GastosListComponent implements OnInit {
  notaDebitoForm: FormGroup;
  bancos: Banco[] = [];
  selectedBankId: string;

  constructor(
    private inversionistaService: InversionistaService,
    private fb: FormBuilder
  ) {
    this.notaDebitoForm = this.fb.group({
      descripcion: ["", Validators.required],
      amount: ["", Validators.required],
      transaction_date: ["", Validators.required],
      to_bank_id: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBancos();
  }

  loadBancos() {
    this.inversionistaService.getBancoList().subscribe({
      next: (data) => {
        this.bancos = data;
      },
    });
  }

  notaDebito() {
    if (this.notaDebitoForm.valid) {
      let bancoDestino = this.notaDebitoForm.value.to_bank_id;
      let cantidad = this.notaDebitoForm.value.amount;
      let descripcion = this.notaDebitoForm.value.descripcion;
      let transaction_date = this.notaDebitoForm.value.transaction_date;

      this.inversionistaService
        .notaDebito(bancoDestino, cantidad, descripcion, transaction_date)
        .subscribe({
          next: (data) => {
            Swal.fire({
              icon: "success",
              title: "Completado",
              html: data.detail,
            }).then((result) => {
              window.location.reload();
            });
          },
        });
    } else {
      this.showFormNotaDebitoErrors();
    }
  }

  showFormNotaDebitoErrors(): void {
    let errorMessage = "";
    for (const key in this.notaDebitoForm.controls) {
      if (this.notaDebitoForm.controls[key].invalid) {
        errorMessage += `Campo ${key} es inválido.<br>`;
      }
    }

    Swal.fire({
      icon: "error",
      title: "Error en el formulario",
      html: errorMessage,
    });
  }
}
