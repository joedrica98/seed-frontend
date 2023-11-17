import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Inversionista } from "src/app/models/inversionista.entity";
import { InversionistaService } from "src/app/services/inversionista/inversionista.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-inversionista-create",
  templateUrl: "./inversionista-create.component.html",
  styleUrls: ["./inversionista-create.component.scss"],
})
export class InversionistaCreateComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inversionistaService: InversionistaService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        cedula: ["", Validators.minLength(10), Validators.maxLength(10)],
        ruc: ["", Validators.minLength(13), Validators.maxLength(13)],
        primer_nombre: ["", Validators.required],
        segundo_nombre: [""],
        primer_apellido: ["", Validators.required],
        segundo_apellido: [""],
        email: ["", [Validators.required, Validators.email]],
        fecha_nacimiento: ["", Validators.required],
        celular: ["", Validators.required],
        direccion: ["", Validators.required],
        banco: ["", Validators.required],
        numero_cuenta: ["", Validators.required],
        tipo_cuenta: ["", Validators.required],
        tipo_inversionista: [""],
      },
      { validator: this.cedulaOrRucValidator }
    );
  }

  cedulaOrRucValidator(form: FormGroup) {
    const cedula = form.get("cedula")?.value;
    const ruc = form.get("ruc")?.value;

    if ((cedula && ruc) || (!cedula && !ruc)) {
      return { cedulaOrRuc: true };
    } else {
      return null;
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      this.createInversionista(this.form.value);
    } else if (this.form.hasError("cedulaOrRuc")) {
      Swal.fire({
        icon: "error",
        title: "Error en el formulario",
        text: "Debe llenar el campo cédula o RUC, pero no ambos.",
      });
    } else {
      this.showFormErrors();
      this.highlightInvalidControls();
    }
  }

  createInversionista(inversionita: Inversionista) {
    this.inversionistaService.createInversionista(inversionita).subscribe({
      next: (data) => {
        Swal.fire(
          "Inversionista creado",
          "Inversionista creado exitosamente",
          "success"
        ).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(["/inversionista"]);
          }
        });
      },
    });
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

  highlightInvalidControls(): void {
    for (const key in this.form.controls) {
      this.form.controls[key].markAsTouched();
    }
  }
}
