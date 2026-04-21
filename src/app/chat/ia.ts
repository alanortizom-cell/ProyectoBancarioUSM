import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7032/api/IA'; // Ajusta a tu puerto

  // ia.service.ts

enviarConsulta(mensaje: string): Observable<any> {
  // CAMBIO: Cambiamos 'prompt' por 'mensaje' para que coincida con ChatRequestDto
  // Uso 'Mensaje' con mayúscula porque tu backend parece estar configurado así
  return this.http.post<any>(`${this.apiUrl}/consultar`, { Mensaje: mensaje });
}
}