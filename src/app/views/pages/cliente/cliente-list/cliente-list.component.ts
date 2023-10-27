import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente.entity';
import { InversionistaService } from 'src/app/services/inversionista/inversionista.service';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(private inversionistaService: InversionistaService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes() {
    this.inversionistaService.getClientetList().subscribe({
      next: (data) => {
        console.log(data);
        this.clientes = data;
      },
    });
  }

}
