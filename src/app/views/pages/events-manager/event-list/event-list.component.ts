import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event-manager/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  eventList: any[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  async loadEvents() {
    await this.eventService.getEventList().subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        Swal.fire('Available Campaigns', 'Error Loading events list', 'error');
      }
    );
  }
}
