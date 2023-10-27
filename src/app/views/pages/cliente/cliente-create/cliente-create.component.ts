import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.entity';
import { InversionistaService } from 'src/app/services/inversionista/inversionista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.scss'],
})
export class ClienteCreateComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inversionistaService: InversionistaService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        cedula: [''],
        ruc: [''],
        primer_nombre: ['', Validators.required],
        segundo_nombre: ['', Validators.required],
        primer_apellido: ['', Validators.required],
        segundo_apellido: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        fecha_nacimiento: ['', Validators.required],
        celular: ['', Validators.required],
        direccion: ['', Validators.required],
        banco: ['', Validators.required],
        numero_cuenta: ['', Validators.required],
        tipo_cuenta: ['', Validators.required],
        nombre_local: ['', Validators.required],
        instagram: ['', Validators.required],
        facebook: ['', Validators.required],
        tiktok: ['', Validators.required],
        puntuacion_buro: ['', Validators.required],
      },
      { validator: this.cedulaOrRucValidator }
    );
  }

  cedulaOrRucValidator(form: FormGroup) {
    const cedula = form.get('cedula')?.value;
    const ruc = form.get('ruc')?.value;

    if ((cedula && ruc) || (!cedula && !ruc)) {
      return { cedulaOrRuc: true };
    } else {
      return null;
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      this.createCliente(this.form.value);
    } else if (this.form.hasError('cedulaOrRuc')) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Debe llenar el campo cédula o RUC, pero no ambos.',
      });
    } else {
      this.showFormErrors();
      this.highlightInvalidControls();
    }
  }

  createCliente(cliente: Cliente) {
    this.inversionistaService.createCliente(cliente).subscribe({
      next: (data) => {
        Swal.fire(
          'Cliente creado',
          'Cliente creado exitosamente',
          'success'
        ).then((result) => {
          this.router.navigate(['/cliente']);
        });
      },
    });
  }

  showFormErrors(): void {
    let errorMessage = '';
    for (const key in this.form.controls) {
      if (this.form.controls[key].invalid) {
        errorMessage += `Campo ${key} es inválido.<br>`;
      }
    }

    Swal.fire({
      icon: 'error',
      title: 'Error en el formulario',
      html: errorMessage,
    });
  }

  highlightInvalidControls(): void {
    for (const key in this.form.controls) {
      this.form.controls[key].markAsTouched();
    }
  }
}
