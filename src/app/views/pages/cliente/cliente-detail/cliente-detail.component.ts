import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Banco } from 'src/app/models/banco.entity';
import { Cliente } from 'src/app/models/cliente.entity';
import { Prestamo } from 'src/app/models/prestamo.entity';
import { InversionistaService } from 'src/app/services/inversionista/inversionista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
  styleUrls: ['./cliente-detail.component.scss'],
})
export class ClienteDetailComponent implements OnInit {
  cliente: Cliente;
  form: FormGroup;
  bancos: Banco[];

  constructor(
    private inversionistaService: InversionistaService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      monto_prestamo: ['', Validators.required],
      interes_cobrar: ['', Validators.required],
      tiempo_prestamo: ['', Validators.required],
      fecha_prestamo: ['', Validators.required],
      forma_pago: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      Swal.fire(
        'No se encontro',
        'No se encontro inversionista con ese Id',
        'error'
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
      .map((banco) => `<option value="${banco.id}">${banco.nombre}</option>`)
      .join('');

    Swal.fire({
      title: '"Dónde realizaste la transacción?',
      html: `
    <select id="selectElement" class="swal2-select">
      <option value="">Seleccionar cuenta</option>
      ${optionsHtml}
    </select>
  `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      preConfirm: () => {
        const selectElement = document.getElementById(
          'selectElement'
        ) as HTMLSelectElement;
        const selectedValue = selectElement.value;
        if (!selectedValue) {
          Swal.showValidationMessage('Por favor selecciona un valor');
          return false;
        }
        return selectedValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let bank_id = result.value; // Add the selected value to the cuota object
        if (!bank_id) {
          return;
        }
        this.inversionistaService
          .updateStatusCuotaPrestador(cuota, bank_id)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Actualizado!',
                text: 'Se cambio el estado de la cuota',
                icon: 'success',
              });
            },
          });
      } else {
        if (cuota.status == 'pagado') {
          cuota.status = 'pendiente';
        } else {
          cuota.status = 'pagado';
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
    var id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      Swal.fire('No se encontro', 'No se encontro cliente con ese Id', 'error');
    } else {
      this.inversionistaService.createPrestamo(id, prestamo).subscribe({
        next: () => {
          Swal.fire(
            'Prestamo creado',
            'Prestamo creado exitosamente',
            'success'
          ).then((result) => {
            window.location.reload();
          });
        },
      });
    }
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
}
