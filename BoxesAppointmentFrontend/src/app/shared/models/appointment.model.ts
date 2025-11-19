import { Person } from './person.model';
import { Vehicle } from './vehicle.model';

export interface Appointment {
  id?: number; 
  place_id: number;
  appointment_at: string; 
  service_type: string;
  contact: Person;
  vehicle?: Vehicle; // Opcional
}