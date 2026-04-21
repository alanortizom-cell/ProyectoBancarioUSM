export interface Usuario {
  id: number;
  nombre: string;
  cedula: string;
  saldo: number;
  numeroDeCuenta: string;
}

export interface UsuarioCreateDto {
  nombre: string;
  cedula: string;
  tieneCuenta: boolean;
  numeroCuenta?: string;
  saldoInicial: number;
}

export interface SolicitudAtencionDto {
  cedula: string;
  numeroCajero: number;
  idServicio: number;
}

export interface Movimiento {
  id: number;
  fecha: Date;
  tipo: number; // Coincide con el enum TipoDeServicio de C#
  monto: number;
  saldoResultante: number;
}

export interface Ticket {
  id: number;
  idUsuario: number;
  idCajero: number;
  idServicio: number;
  horaDeLlegada: Date;
  estado: number; 
}

export interface AuthResponse {
  token: string;
}