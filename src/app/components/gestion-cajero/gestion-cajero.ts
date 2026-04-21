import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BankService } from 'app/bank/bank';

@Component({
  selector: 'app-gestion-cajero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-cajero.html',
  styleUrls: ['./gestion-cajero.css']
})
export class GestionCajero implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private bankService = inject(BankService);
  private cdr = inject(ChangeDetectorRef);

  idCajeroUrl: number = 0;
  cola: any[] = [];
  clienteSiendoAtendido: any = null;
  mensaje: string = '';
  tipoMensaje: 'exito' | 'error' = 'exito';
  private intervalId: any;

  // Modales y Datos
  mostrarModal: boolean = false; // Modal Apertura (Cajero 5)
  mostrarModalTransaccion: boolean = false; // Modal Operaciones (Cajeros 1-4)
  enviando: boolean = false;

  // Datos para Módulo 5
  datosApertura = {
    cedula: '',
    numeroCuenta: '',
    saldoInicial: 50,
    ticketId: 0
  };

  // Datos para Módulos 1-4
  montoOperacion: number = 0;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && !isNaN(+id)) {
        this.idCajeroUrl = +id;
        this.cargarCola();
        if (!this.intervalId) {
          this.intervalId = setInterval(() => this.cargarCola(), 5000);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

 cargarCola() {
  if (!this.idCajeroUrl) return;
  this.bankService.getColaPorCajero(this.idCajeroUrl).subscribe({
    next: (data: any[]) => {
      this.cola = data.map(item => ({
        ticketId: item.ticketId || item.TicketId,
        nombre: item.nombre || item.Nombre,
        cedula: item.cedula || item.Cedula,
        // CORRECCIÓN: Buscamos todas las variantes posibles del nombre que viene del backend
        montoRegistrado: item.montoOperacion ?? item.MontoOperacion ?? 0, 
        estado: item.estado || item.Estado
      }));

      this.clienteSiendoAtendido = this.cola.find(t => t.estado === 1);
      // Actualizamos el monto si ya estamos atendiendo a alguien
      if (this.clienteSiendoAtendido) {
        this.montoOperacion = this.clienteSiendoAtendido.montoRegistrado;
      }
      this.cdr.detectChanges();
    }
  });
}


marcarAtendido(ticket: any) {
  this.clienteSiendoAtendido = ticket;

  this.bankService.getPerfilPorCedula(ticket.cedula).subscribe({
    next: (usuarioReal: any) => {
      if (this.idCajeroUrl === 5) {
        this.datosApertura.cedula = usuarioReal.cedula;
        this.datosApertura.ticketId = ticket.ticketId;
        
        // ¡ESTO ES LO MÁS IMPORTANTE!
        // Ignoramos el 'usuarioReal.saldo' (que es 0) y usamos el monto del ticket
        this.datosApertura.saldoInicial = ticket.montoRegistrado; 

        this.clienteSiendoAtendido.edad = usuarioReal.edad; 
        this.datosApertura.numeroCuenta = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        this.mostrarModal = true;
      } else {
        this.montoOperacion = ticket.montoRegistrado;
        this.mostrarModalTransaccion = true;
      }
      this.cdr.detectChanges();
    }
  });
}confirmarAtencionGeneral(esApertura: boolean) {
    this.enviando = true;

    const payload = {
      numeroCajero: this.idCajeroUrl,
      // Usamos el monto que está cargado en el modal de apertura
      monto: esApertura ? this.datosApertura.saldoInicial : this.montoOperacion,
      edad: esApertura ? this.clienteSiendoAtendido.edad : 0,
      numeroCuentaNuevo: esApertura ? this.datosApertura.numeroCuenta : null,
      cedula: this.clienteSiendoAtendido.cedula // Asegúrate de enviar la cédula si tu servicio la pide
    };
    this.bankService.procesarAtencion(payload).subscribe({
      next: () => {
        this.mostrarNotificacion("¡Cuenta Creada! No: " + payload.numeroCuentaNuevo, 'exito');
        this.cerrarModales();
        this.cargarCola();
        this.enviando = false;
      },
      error: (err) => {
        this.mostrarNotificacion("Error al procesar", 'error');
        this.enviando = false;
      }
    });
}

  cerrarModales() {
    this.mostrarModal = false;
    this.mostrarModalTransaccion = false;
    this.clienteSiendoAtendido = null;
  }

  // gestion-cajero.ts
llamarSiguiente() {
  if (this.clienteSiendoAtendido) {
    this.mostrarNotificacion("Ya hay un cliente en atención.", 'error');
    return;
  }
  
  this.bankService.llamarAlSiguienteDelBackend(this.idCajeroUrl).subscribe({
    next: (ticketLlamado: any) => { 
      this.cargarCola();
      // Usamos ?. para evitar errores si el objeto es nulo
      const codigo = ticketLlamado?.codigoTurno || ticketLlamado?.CodigoTurno || 'Siguiente';
      this.mostrarNotificacion(`Llamando a: ${codigo}`, 'exito');
    },
    error: (err) => {
      console.error("Error detallado:", err);
      this.mostrarNotificacion("No hay nadie más en espera.", 'error');
    }
  });
}

  cancelarTurno(ticketId: number) {
    if (confirm("¿Marcar como ausente?")) {
      this.bankService.actualizarEstadoTicket(ticketId, 3).subscribe(() => this.cargarCola());
    }
  }

  mostrarNotificacion(msg: string, tipo: 'exito' | 'error') {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    setTimeout(() => this.mensaje = '', 3500);
  }
}