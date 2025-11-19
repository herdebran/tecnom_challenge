import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppointmentService } from '../../core/services/appointment.service';
import { WorkshopService } from '../../core/services/workshop.service';
import { Workshop } from '../../shared/models/workshop.model';
import { Person } from '../../shared/models/person.model';
import { Vehicle } from '../../shared/models/vehicle.model';
import { Appointment } from '../../shared/models/appointment.model';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-appointment',
  standalone: false,
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  workshops: Workshop[] = [];
  loadingWorkshops = true;
  loadingSubmit = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private workshopService: WorkshopService,
    private snackBar: MatSnackBar,
    private router: Router 
  ) {
    this.appointmentForm = this.fb.group({
      place_id: ['', Validators.required],
      appointment_at: ['', Validators.required],
      service_type: ['', [Validators.required, Validators.minLength(2)]],
      contact_name: ['', [Validators.required, Validators.minLength(2)]],
      contact_email: ['', [Validators.required, Validators.email]],
      contact_phone: ['', [Validators.required, Validators.minLength(6)]],
      vehicle_make: [''],
      vehicle_model: [''],
      vehicle_year: [''],
      vehicle_license_plate: ['']
    });
  }

  ngOnInit(): void {
    this.loadWorkshops();
  }

  loadWorkshops(): void {
    this.workshopService.getActiveWorkshops().subscribe({
      next: (workshops) => {
        this.workshops = workshops;
        this.loadingWorkshops = false;
      },
      error: (error) => {
        console.error('Error al cargar talleres:', error);
        this.snackBar.open('Error al cargar talleres. Intente más tarde.', 'Cerrar', { duration: 5000 });
        this.loadingWorkshops = false;
      }
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid && !this.loadingSubmit) {
      this.loadingSubmit = true;
      const formValues = this.appointmentForm.value;

      const newAppointment: Omit<Appointment, 'id'> = {
        place_id: formValues.place_id,
        appointment_at: formValues.appointment_at.toISOString(), 
        service_type: formValues.service_type,
        contact: {
          name: formValues.contact_name,
          email: formValues.contact_email,
          phone: formValues.contact_phone
        } as Person,
        vehicle: (formValues.vehicle_make || formValues.vehicle_model || formValues.vehicle_year || formValues.vehicle_license_plate) ? {
          make: formValues.vehicle_make,
          model: formValues.vehicle_model,
          year: formValues.vehicle_year,
          license_plate: formValues.vehicle_license_plate
        } as Vehicle : undefined
      };

      this.appointmentService.createAppointment(newAppointment)
      .pipe(
        finalize(() => {
            this.loadingSubmit = false;
        }))
      .subscribe({
        next: (createdAppointment) => {
          this.snackBar.open('Turno creado exitosamente!', 'Cerrar', { duration: 3000 }); // Mensaje que dura 3 segundos
          this.appointmentForm.reset();
          // Navegar a la lista de turnos
          this.router.navigate(['/turnos']).then(() => {
          });
        },
        error: (error: HttpErrorResponse) => {
        console.log('API error raw:', error); 
        let errorMessage = 'Ha ocurrido un error inesperado.';

        // Caso 1: backend envía { field, message }
        if (error.error && error.error.message) {
          errorMessage = error.error.message;

          // intentar setear error en el control correspondiente
          const serverField = String(error.error.field || '');
          const controlName = this.serverFieldToControlName(serverField);
          const control = this.appointmentForm.get(controlName);
          if (control) {
            control.setErrors({ server: errorMessage });
            control.markAsTouched();
          }
        }
        // Caso 2: ModelState .NET: error.error.errors
        else if (error.error && error.error.errors) {
          const firstKey = Object.keys(error.error.errors)[0];
          if (firstKey) {
            errorMessage = error.error.errors[firstKey][0];
            const control = this.appointmentForm.get(this.serverFieldToControlName(firstKey));
            if (control) {
              control.setErrors({ server: errorMessage });
              control.markAsTouched();
            }
          }
        }
        // Caso 3: mensaje plano
        else if (typeof error.error === 'string') {
          errorMessage = error.error;
        }
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', { duration: 3000 });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.appointmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  serverFieldToControlName(serverField: string): string {
  if (!serverField) return serverField;
  return serverField.charAt(0).toLowerCase() + serverField.slice(1);
}
}