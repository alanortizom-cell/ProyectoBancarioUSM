import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, SolicitudAtencionDto, Ticket, Movimiento } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7032/api';

procesarAtencion(dto: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/Cajero/procesar-atencion`, dto, {
    responseType: 'text' // Usamos 'text' porque tu C# devuelve return Ok("...") un string simple
  });
}
  getPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/Usuarios/perfil`);
  }
  actualizarEstadoTicket(ticketId: number, nuevoEstado: number): Observable<any> {
  return this.http.patch(`https://localhost:7032/api/Tickets/actualizar-estado/${ticketId}`, nuevoEstado, {
    headers: { 'Content-Type': 'application/json' }
  });
}
  // 2. Enviar datos del usuario al cajero (CORRECCIÓN)
  // Usamos PATCH o PUT porque estamos actualizando un ticket que ya existe
  enviarOperacion(ticketId: number, datos: any): Observable<any> {
    const payload = {
      monto: datos.monto,
      descripcion: datos.descripcion,
      // Aquí podrías añadir un flag para avisar al cajero
      datosRecibidos: true 
    };
    return this.http.patch(`${this.apiUrl}/actualizar-operacion/${ticketId}`, payload);
  }
  getMovimientos(cedula: string): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.apiUrl}/Cajero/${cedula}/historial-pila`);
  }

  getColaPorCajero(idCajero: number) {
    return this.http.get<any[]>(`${this.apiUrl}/Tickets/cola-cajero/${idCajero}`);
  }

llamarAlSiguienteDelBackend(idCajero: number) {
  // Cambiamos el {} por null
  return this.http.post<any>(`${this.apiUrl}/Cajero/${idCajero}/llamar-siguiente`, null);
}

  finalizarApertura(datos: any) {
    return this.http.post(`${this.apiUrl}/Tickets/finalizar-apertura`, datos);
  }
  solicitarTicket(solicitud: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/Tickets/pedir-turno`, solicitud);
}
getMiTicketActivo(cedula: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/Tickets/activo-por-cedula/${cedula}`);
}
getTicketById(id: number) {
  return this.http.get(`${this.apiUrl}/tickets/${id}`);
}
// En tu bank.service.ts (o donde tengas las peticiones)

// Para la apertura de cuenta
actualizarDatosApertura(idTicket: number, datos: any) {
  return this.http.patch(`${this.apiUrl}/Tickets/actualizar-datos-apertura/${idTicket}`, datos);
}

// Para depósitos/retiros normales
actualizarMontoSimple(idTicket: number, datos: any) {
  return this.http.patch(`${this.apiUrl}/Tickets/actualizar-monto-usuario/${idTicket}`, datos);
}

// bank.service.ts

// Opción A: Corregir el método que ya usa el componente
actualizarDatosTicket(ticketId: number, datos: any): Observable<any> {
  // Cambiamos la URL a la que SI existe en el controlador
  return this.http.patch(`${this.apiUrl}/Tickets/actualizar-monto-usuario/${ticketId}`, datos);
}

getPerfilPorCedula(cedula: string): Observable<any> {
  // Cambiamos 'Usuarios/perfil' por 'Tickets/perfil-usuario'
  return this.http.get(`${this.apiUrl}/Tickets/perfil-usuario/${cedula}`);
}
}
