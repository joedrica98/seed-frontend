import { Component, OnInit } from '@angular/core';
import { InversionistaService } from 'src/app/services/inversionista/inversionista.service';

@Component({
  selector: 'app-movimientos-list',
  templateUrl: './movimientos-list.component.html',
  styleUrls: ['./movimientos-list.component.scss'],
})
export class MovimientosListComponent implements OnInit {
  transacciones: any;
  constructor(private inversionistaService: InversionistaService) {}

  ngOnInit(): void {
    this.inversionistaService.getTransacciones().subscribe({
      next: (data) => {
        this.transacciones = data;
      },
    });
  }
}
