import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Inversionista } from 'src/app/models/inversionista.entity';
import { InversionistaService } from 'src/app/services/inversionista/inversionista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inversionista-create',
  templateUrl: './inversionista-create.component.html',
  styleUrls: ['./inversionista-create.component.scss'],
})
export class InversionistaCreateComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inversionistaService: InversionistaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      cedula: ['', Validators.required],
      ruc: ['', Validators.required],
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      primer_apellido: ['', Validators.required],
      segundo_apellido: [''],
      email: ['', [Validators.required, Validators.email]],
      fecha_nacimiento: ['', Validators.required],
      celular: ['', Validators.required],
      direccion: ['', Validators.required],
      banco: ['', Validators.required],
      numero_cuenta: ['', Validators.required],
      tipo_cuenta: ['', Validators.required],
      tipo_inversionista: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      this.createInversionista(this.form.value);
    } else {
      this.showFormErrors();
      this.highlightInvalidControls();
    }
  }

  createInversionista(inversionita: Inversionista) {
    this.inversionistaService.createInversionista(inversionita).subscribe({
      next: (data) => {
        Swal.fire(
          'Inversionista creado',
          'Inversionista creado exitosamente',
          'success'
        ).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/inversionista']);
          }
        });;
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
