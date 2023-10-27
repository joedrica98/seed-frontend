import { Component, OnInit } from '@angular/core';
import { Inversionista } from 'src/app/models/inversionista.entity';
import { InversionistaService } from 'src/app/services/inversionista/inversionista.service';

@Component({
  selector: 'app-inversionista-list',
  templateUrl: './inversionista-list.component.html',
  styleUrls: ['./inversionista-list.component.scss'],
})
export class InversionistaListComponent implements OnInit {
  inversionistas: Inversionista[] = [];

  constructor(private inversionistaService: InversionistaService) {}

  ngOnInit(): void {
    this.loadIversionistas();
  }

  loadIversionistas() {
    this.inversionistaService.getInversionistatList().subscribe({
      next: (data) => {
        console.log(data);
        this.inversionistas = data;
      },
    });
  }
}
