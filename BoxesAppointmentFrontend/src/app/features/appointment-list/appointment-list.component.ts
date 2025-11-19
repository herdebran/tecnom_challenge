import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../shared/models/appointment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkshopService } from '../../core/services/workshop.service';
import { Workshop } from '../../shared/models/workshop.model';

@Component({
  selector: 'app-appointment-list',
  standalone: false,
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  displayedColumns: string[] = ['taller', 'fecha_hora', 'servicio', 'cliente', 'patente'];
  appointments: Appointment[] = [];
  loading = true;
  workshops: Workshop[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private workshopService: WorkshopService
  ) {}

  ngOnInit(): void {
    this.loadWorkshops();
    this.loadAppointments();
  }

  loadWorkshops(): void {
    this.workshopService.getActiveWorkshops().subscribe({
      next: (workshops) => {
        this.workshops = workshops; // Almacena la lista de talleres
      },
      error: (error) => {
        console.error('Error al cargar talleres:', error);
        this.snackBar.open('No se pudieron cargar los nombres de los talleres.', 'Cerrar', { duration: 5000 });
      }
    });
  }
  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar turnos:', error);
        this.snackBar.open('Error al cargar turnos. Intente más tarde.', 'Cerrar', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  getTallerName(placeId: number): string {
    const workshop = this.workshops.find(w => w.id === placeId);
    return workshop ? workshop.name : `Taller ${placeId}`; 
  }


  getVehicleInfo(vehicle?: any): string {
    if (!vehicle) return 'N/A';
    return `${vehicle.make} ${vehicle.model} (${vehicle.year}) ${vehicle.license_plate || ''}`.trim();
  }
}