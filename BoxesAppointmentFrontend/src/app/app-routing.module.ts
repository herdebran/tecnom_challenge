import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentComponent } from './features/appointment/appointment.component';
import { AppointmentListComponent } from './features/appointment-list/appointment-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/crear-turno', pathMatch: 'full' },
  { path: 'crear-turno', component: AppointmentComponent },
  { path: 'turnos', component: AppointmentListComponent },
  { path: '**', redirectTo: '/turnos' } //Si la ruta no se encuentra, lo mando a ver la lista de turnos
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }