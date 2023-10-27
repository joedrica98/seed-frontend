import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Banco } from 'src/app/models/banco.entity';
import { Inversion } from 'src/app/models/inversion.entity';
import { Inversionista } from 'src/app/models/inversionista.entity';
import { InversionistaService } from 'src/app/services/inversionista/inversionista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inversionista-detail',
  templateUrl: './inversionista-detail.component.html',
  styleUrls: ['./inversionista-detail.component.scss'],
})
export class InversionistaDetailComponent implements OnInit {
  inversionista: Inversionista;
  form: FormGroup;
  bancos: Banco[];

  constructor(
    private inversionistaService: InversionistaService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      capital: ['', Validators.required],
      interes_mensual: ['', Validators.required],
      meses_inversion: ['', Validators.required],
      fecha_inversion: ['', Validators.required],
      tipo_inversion: ['', Validators.required],
      fecha_pago: [''],
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
      this.inversionistaService.getInversionistaById(id).subscribe({
        next: (data) => {
          this.inversionista = data;
        },
      });
    }
    this.inversionistaService.getBancoList().subscribe({
      next: (data) => {
        this.bancos = data;
      },
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.createInversion(this.form.value);
    } else {
      this.showFormErrors();
    }
  }

  createInversion(inversion: Inversion) {
    var id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      Swal.fire(
        'No se encontro',
        'No se encontro inversionista con ese Id',
        'error'
      );
    } else {
      this.inversionistaService.createInversion(id, inversion).subscribe({
        next: () => {
          Swal.fire(
            'Inversión creada',
            'Inversion creada exitosamente',
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
        this.inversionistaService.updateStatusCuota(cuota, bank_id).subscribe({
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

  precancelarCuotas(id: string) {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Quieres precancelar la inverión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.inversionistaService.precancelarCuotas(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Actualizado!',
              text: 'Se precancelo la inversión!',
              icon: 'success',
            }).then((result) => {
              window.location.reload();
            });
          },
        });
      }
    });
  }

  retirarDinero(inversionId: any) {
    Swal.fire({
      title: 'Cuanto dinero quieres retirar?',
      html: `
      <input
              type="number"
              class="form-control"
              id="selectElement"
            />
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
          Swal.showValidationMessage('Por favor ingresa un valor');
          return false;
        }
        return selectedValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let withdraw_amount = result.value; // Add the selected value to the cuota object
        if (!withdraw_amount) {
          return;
        }
        this.inversionistaService
          .retirarDineroInversion(+withdraw_amount, inversionId)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Actualizado!',
                text: 'Se cambio el estado de la cuota',
                icon: 'success',
              });
            },
          });
      }
    });
  }
}
