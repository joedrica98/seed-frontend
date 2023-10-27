import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimientosListComponent } from './movimientos-list/movimientos-list.component';
import { RouterModule, Routes } from '@angular/router';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MovimientosListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [MovimientosListComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FeatherIconModule],
})
export class MovimientosModule {}
