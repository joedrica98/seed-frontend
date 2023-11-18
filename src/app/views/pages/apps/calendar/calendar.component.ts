import { Component, OnInit } from "@angular/core";
import { CalendarOptions, EventApi } from "@fullcalendar/angular";
import { InversionistaService } from "src/app/services/inversionista/inversionista.service";
// Asegúrate de importar también el servicio de clientes

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit {
  inversionistaEvents = [];
  clienteEvents = []; // Asumiendo que esta propiedad será llenada similar a inversionistaEvents
  calendarOptions: CalendarOptions;
  currentEvents: EventApi[] = [];

  constructor(
    private inversionistaService: InversionistaService // private clienteService: ClienteService // Asegúrate de descomentar y proporcionar el servicio real
  ) {}

  ngOnInit(): void {
    this.loadCuotasInversionista();
    this.loadCuotasCliente(); 
  }

  loadCuotasInversionista() {
    this.inversionistaService.getCuotasInversionistas().subscribe({
      next: (data) => {
        this.inversionistaEvents = data.map((cuota: any) => {
          // El color del evento basado en el estado de la cuota
          const eventColor =
            cuota.status === "pendiente" ? "#FFEB3B" : "#4CAF50"; // Amarillo para pendiente, verde para pagado

          return {
            id: cuota.id,
            start: cuota.fecha_pago,
            title: `Pagar cuota de $${cuota.cantidad} a inverionista ${cuota.inversionista_full_name}`,
            color: eventColor, // Esta propiedad cambia el color del evento y del punto
            display: "block",
          };
        });
        this.updateCalendarOptions();
      },
      error: (err) => {
        console.error("Error loading inversionista events:", err);
      },
    });
  }

  loadCuotasCliente() {
    this.inversionistaService.getCuotasClientes().subscribe({
      next: (data) => {
        this.inversionistaEvents = data.map((cuota: any) => {
          // El color del evento basado en el estado de la cuota
          const eventColor =
            cuota.status === "pendiente" ? "#FFEB3B" : "#4CAF50"; // Amarillo para pendiente, verde para pagado

          return {
            id: cuota.id,
            start: cuota.fecha_pago,
            title: `Cobrar cuota de $${cuota.cantidad} a cliente ${cuota.cliente_full_name}`,
            color: eventColor, // Esta propiedad cambia el color del evento y del punto
            display: "block",
          };
        });
        this.updateCalendarOptions();
      },
      error: (err) => {
        console.error("Error loading cliente events:", err);
      },
    });
  }

  updateCalendarOptions() {
    this.calendarOptions = {
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "listWeek",
      },
      initialView: "listWeek",
      events: [...this.inversionistaEvents, ...this.clienteEvents],
      weekends: true,
      editable: false,
      selectable: false,
      eventClick: () => {}, // Función vacía para deshabilitar la acción de clic
      eventsSet: this.handleEvents.bind(this),
    };
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}
