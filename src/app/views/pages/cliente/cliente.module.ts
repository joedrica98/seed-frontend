import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ClienteCreateComponent } from './cliente-create/cliente-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteDetailComponent } from './cliente-detail/cliente-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ClienteListComponent,
      },
      {
        path: 'create',
        component: ClienteCreateComponent,
      },
      {
        path: ':id',
        component: ClienteDetailComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    ClienteListComponent,
    ClienteCreateComponent,
    ClienteDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ClientesModule {}
