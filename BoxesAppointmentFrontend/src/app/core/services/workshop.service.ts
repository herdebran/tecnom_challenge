import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Workshop } from '../../shared/models/workshop.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  private readonly apiUrl = `${environment.apiUrl}/workshops`;

  constructor(private http: HttpClient) { }

  getActiveWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error en WorkshopService:', error);
    return throwError(() => new Error('No se pudieron cargar los talleres. Intente más tarde.'));
  }
}