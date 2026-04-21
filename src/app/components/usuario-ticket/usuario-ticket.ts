import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BankService } from 'app/bank/bank';

@Component({
  selector: 'app-usuario-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-ticket.html',
  styleUrls: ['./usuario-ticket.css']
})
export class UsuarioTicket implements OnInit, OnDestroy {
  private bankService = inject(BankService);
  private route = inject(ActivatedRoute);

  ticketId: number = 0;
  datosTicket: any = null;
  
  // Esta es la variable que te faltaba
  formularioEnviado: boolean = false; 
  
  formulario = {
    monto: 0,
    descripcion: ''
  };

  private intervalId: any;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.ticketId = +params['id'];
      if (this.ticketId) {
        this.iniciarEscucha();
      }
    });
  }

  iniciarEscucha() {
    // Polling cada 3 segundos
    this.intervalId = setInterval(() => {
      this.bankService.getTicketById(this.ticketId).subscribe({
        next: (ticket) => {
          this.datosTicket = ticket;
          
          // Si el cajero ya lo finalizó (Estado 2), limpiamos todo
          if (this.datosTicket.estado === 2) {
            this.formularioEnviado = false; 
            clearInterval(this.intervalId);
          }
        },
        error: (err) => console.error("Error al obtener ticket:", err)
      });
    }, 3000);
  }

  enviarDatos() {
    if (this.formulario.monto <= 0) {
      alert("Por favor, ingresa un monto válido.");
      return;
    }

    this.bankService.enviarOperacion(this.ticketId, this.formulario).subscribe({
      next: () => {
        // Al enviar con éxito, el HTML mostrará el estado de "Procesando..."
        this.formularioEnviado = true;
      },
      error: (err) => {
        console.error("Error al enviar datos:", err);
        alert("Hubo un error al enviar la información al cajero.");
      }
    });
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}