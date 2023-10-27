import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastosListComponent } from './gastos-list/gastos-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: GastosListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [GastosListComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class GastosModule {}
