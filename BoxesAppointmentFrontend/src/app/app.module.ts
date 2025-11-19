import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppointmentModule } from './features/appointment.module';
import { AppointmentListModule } from './features/appointment-list/appointment-list.module';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    HttpClientModule, 
    MatSnackBarModule,
    MatButtonModule,
    AppointmentModule,
    AppointmentListModule,
    AppComponent 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }