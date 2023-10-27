import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/angular';
import { InversionistaService } from 'src/app/services/inversionista/inversionista.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('externalEvents', { static: true }) externalEvents: ElementRef;
  inversionistaEventsLoaded = false;

  DAY_STR(dateObj: Date) {
    if (dateObj.getUTCMonth() < 10) {
      return (
        dateObj.getUTCFullYear() + '-' + ('0' + (dateObj.getUTCMonth() + 1))
      );
    } else {
      return dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
    }
  }

  inversionitaEvents = [{}];

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    initialEvents: this.inversionitaEvents, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];

  constructor(private inversionistaService: InversionistaService) {}

  ngOnInit(): void {
    this.loadCuotasInversionista();
  }

  loadCuotasInversionista() {
    this.inversionistaService.getCuotasInversionistas().subscribe({
      next: (data) => {
        data.forEach((cuota: any) => {
          this.inversionitaEvents.push({
            id: cuota.id + cuota.inversionista_full_name,
            start: new Date(cuota.fecha_pago),
            allDay: true,
            title: 'Inversionista ' + cuota.inversionista_full_name,
            description:
              'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
            backgroundColor: 'rgba(1,104,250, .15)',
            borderColor: '#0168fa',
            display: 'block',
          });
        });
        console.log(this.inversionitaEvents);
        this.inversionistaEventsLoaded = true;
      },
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: '1',
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        backgroundColor: 'rgba(0,204,204,.25)',
        borderColor: '#00cccc',
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}
