import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BankService } from '../bank';
import { catchError, of, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cajeros',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cajeros.html',
  styleUrls: ['./cajeros.css']
})
export class Cajeros implements OnInit, OnDestroy {
  private bankService = inject(BankService);
  private cdr = inject(ChangeDetectorRef);

  usuario: any = null;
  ticketActivo: any = null;
  mensaje: string = '';
  tipoMensaje: 'exito' | 'error' = 'exito';
  
  // Propiedades de formulario
  edadUsuario: number | null = null;
  saldoApertura: number | null = null; // <-- Nueva propiedad
  montoOperacion: number | null = null;
  enviandoDatos: boolean = false;
  datosEnviados: boolean = false;

  private destroy$ = new Subject<void>();
  private stopPolling$ = new Subject<void>();

  cajerosConfig = [
    { id: 1, nombre: 'Depositar', desc: 'Depósitos de dinero en efectivo.' },
    { id: 2, nombre: 'Retirar', desc: 'Retiros de efectivo de su cuenta.' },
    { id: 3, nombre: 'Cobrar Cheques', desc: 'Cambio de cheques por efectivo.' },
    { id: 4, nombre: 'Pagar Tarjetas', desc: 'Pago de tarjetas de crédito/débito.' },
    { id: 5, nombre: 'Gestión de Cuentas', desc: 'Apertura de cuentas nuevas.' }
  ];

  ngOnInit() {
    this.cargarPerfil();
    this.iniciarSeguimientoTicket();
  }

  iniciarSeguimientoTicket() {
    timer(0, 5000)
      .pipe(
        takeUntil(this.stopPolling$),
        switchMap(() => {
          if (this.usuario?.Cedula) {
            return this.bankService.getMiTicketActivo(this.usuario.Cedula).pipe(
              catchError(() => of(null))
            );
          }
          return of(null);
        })
      )
      .subscribe(ticket => {
        if (ticket) {
          const estado = ticket.estado ?? ticket.Estado;
          if (estado === 1 && (!this.ticketActivo || (this.ticketActivo.estado === 0))) {
            this.notificarTurno();
          }
          this.ticketActivo = ticket;
        } else {
          this.ticketActivo = null;
          this.datosEnviados = false;
        }
        this.cdr.detectChanges();
      });
  }

  cargarPerfil() {
    this.bankService.getPerfil().subscribe({
      next: (user) => {
        this.usuario = user;
        if (this.usuario?.Cedula) this.obtenerTicketActual(this.usuario.Cedula);
      },
      error: (err) => console.error('Error cargando perfil', err)
    });
  }

  obtenerTicketActual(cedula: string) {
    this.bankService.getMiTicketActivo(cedula).subscribe({
      next: (ticket) => {
        this.ticketActivo = ticket;
        this.cdr.detectChanges();
      },
      error: () => this.ticketActivo = null
    });
  }

  isCajeroBloqueado(idCajero: number): boolean {
    const tieneCuenta = this.usuario?.NumeroDeCuenta !== 'S/N' && this.usuario?.NumeroDeCuenta !== '000-000';
    if (!tieneCuenta && idCajero !== 5) return true;
    if (tieneCuenta && idCajero === 5) return true;
    return false;
  }

  solicitarTicket(idCajero: number) {
  const solicitud = { 
    cedula: this.usuario.Cedula, 
    numeroCajero: idCajero, 
    idServicio: idCajero 
  };

  this.bankService.solicitarTicket(solicitud).subscribe({
    next: (res) => {
      this.ticketActivo = res;
      this.mostrarMensaje(`Turno ${res.codigo} solicitado con éxito.`, 'exito');
    },
    error: (err) => {
      // Aquí 'err.error.mensaje' contiene el texto "La cola está llena..." enviado desde C#
      const msg = err.error?.mensaje || "Error al solicitar turno.";
      this.mostrarMensaje(msg, 'error');
    }
  });
}

  enviarDatosOperacion() {
  console.log("¡Botón presionado!"); // Si esto no sale en F12, el problema es el HTML
  console.log("Valor del monto:", this.montoOperacion);

  if (!this.montoOperacion || this.montoOperacion <= 0) {
    this.mostrarMensaje("Ingrese un monto válido.", 'error');
    return;
  }

  const idCajero = this.ticketActivo?.idCajero || this.ticketActivo?.IdCajero;
  console.log("ID del Cajero actual:", idCajero);

  // Verificamos si el saldo es suficiente (si es retiro)
  if ((idCajero === 2 || idCajero === 4) && this.montoOperacion > this.usuario.Saldo) {
    this.mostrarMensaje(`Saldo insuficiente.`, 'error');
    return;
  }

  this.procesarEnvio(this.montoOperacion);
}

  enviarDatosApertura() {
    if (!this.edadUsuario || this.edadUsuario < 18) {
      this.mostrarMensaje("Debe ser mayor de 18 años.", 'error');
      return;
    }
    if (this.saldoApertura === null || this.saldoApertura < 0) {
      this.mostrarMensaje("Ingrese un saldo inicial válido.", 'error');
      return;
    }
    // Enviamos ambos datos al backend
    this.procesarEnvioMultiple(this.edadUsuario, this.saldoApertura);
  }

 // cajeros.ts -> dentro de procesarEnvio()

private procesarEnvio(valor: number) {
  const idActual = this.ticketActivo?.id || this.ticketActivo?.Id;
  this.enviandoDatos = true;

  // El Backend recibirá este "Saldo" y lo asignará a ticket.MontoOperacion
  this.bankService.actualizarDatosTicket(idActual, { Saldo: valor }).subscribe({
    next: () => {
      this.enviandoDatos = false;
      this.datosEnviados = true;
      this.mostrarMensaje("Monto registrado. Espere su turno.", 'exito');
      // Limpiamos el input después del éxito
      this.montoOperacion = null;
    },
    error: (err) => {
      console.error(err);
      this.enviandoDatos = false;
      this.mostrarMensaje("Error al registrar el monto.", "error");
    }
  });
}
 private procesarEnvioMultiple(edad: number, saldo: number) {
  const idActual = this.ticketActivo?.id || this.ticketActivo?.ticketId || this.ticketActivo?.Id;
  this.enviandoDatos = true;

  // Mantenemos la estructura que espera tu controlador en TicketsController
  const payload = { 
    Saldo: Number(saldo), // Se guardará en ticket.MontoOperacion
    Edad: Number(edad)    // Se guardará en usuario.Edad (esto es correcto solo en apertura)
  };

  this.bankService.actualizarDatosApertura(idActual, payload).subscribe({
    next: () => {
      this.enviandoDatos = false;
      this.datosEnviados = true;
      this.mostrarMensaje("Datos de apertura enviados. Espere a ser llamado.", 'exito');
      // Limpiamos campos
      this.edadUsuario = null;
      this.saldoApertura = null;
    },
    error: (err) => {
      this.enviandoDatos = false;
      console.error("Error al enviar datos:", err);
      this.mostrarMensaje("Error de comunicación con el servidor.", "error");
    }
  });
}

  mostrarMensaje(texto: string, tipo: 'exito' | 'error') {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
    setTimeout(() => this.mensaje = '', 5000);
  }

  notificarTurno() {
    const audio = new Audio('assets/sounds/notification.mp3');
    audio.play().catch(() => {});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopPolling$.next();
    this.stopPolling$.complete();
  }
}