import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, Usuario } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'https://localhost:7032/api/Auth'; 

  // Iniciar sesión con la cédula
  login(cedula: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, JSON.stringify({ cedula, password }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Verificar si hay una sesión activa
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtener el Token para el interceptor
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  // En auth.service.ts, cambia el método register:
  register(datosUsuario: any): Observable<any> {
  // TU RUTA REAL SEGÚN EL CONTROLADOR UsuariosController ES:
    return this.http.post<any>(`https://localhost:7032/api/Usuarios`, datosUsuario);
  }
}