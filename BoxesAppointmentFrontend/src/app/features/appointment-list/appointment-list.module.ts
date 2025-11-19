// Este módulo es opcional si el componente no tiene lógica compleja
// Puede ser standalone o no, dependiendo de su uso
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentListComponent } from './appointment-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppointmentListComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  exports: [
    AppointmentListComponent
  ]
})
export class AppointmentListModule { }