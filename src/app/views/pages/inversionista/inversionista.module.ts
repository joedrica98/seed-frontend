import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InversionistaDetailComponent } from './inversionista-detail/inversionista-detail.component';
import { InversionistaListComponent } from './inversionista-list/inversionista-list.component';
import { InversionistaCreateComponent } from './inversionista-create/inversionista-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { CalendarComponent } from '../apps/calendar/calendar.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: InversionistaListComponent,
      },
      {
        path: 'calendario',
        component: CalendarComponent,
      },
      {
        path: 'create',
        component: InversionistaCreateComponent,
      },
      {
        path: ':id',
        component: InversionistaDetailComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    InversionistaListComponent,
    InversionistaDetailComponent,
    InversionistaCreateComponent,
  ],
  imports: [
    FullCalendarModule,
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class InversionistaModule {}
