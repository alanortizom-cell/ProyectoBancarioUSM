import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankService } from '../bank';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movimientos.html',
  styleUrls: ['./movimientos.css']
})
export class MovimientosComponent implements OnInit {
  private bankService = inject(BankService);
  private cdr = inject(ChangeDetectorRef);
  
  usuario: any = null;
  pilaMovimientos: any[] = [];
  cargando: boolean = false;

  ngOnInit() {
    this.cargarHistorial();
  }

  // Mapeador de Tipos de Servicio (Coincide con tu Enum en C#)
  getTipoConfig(tipoId: number) {
    const configs: any = {
      1: { label: 'Depósito', class: 'op-deposit', icon: 'patch-plus' },
      2: { label: 'Retiro', class: 'op-withdrawal', icon: 'patch-minus' },
      3: { label: 'Cobro Cheque', class: 'op-cheque', icon: 'file-earmark-text' },
      4: { label: 'Pago Tarjeta', class: 'op-payment', icon: 'credit-card' },
      5: { label: 'Apertura', class: 'op-opening', icon: 'house-door' }
    };
    return configs[tipoId] || { label: 'Otros', class: 'op-default', icon: 'arrow-repeat' };
  }

  cargarHistorial() {
    this.cargando = true;
    this.bankService.getPerfil().subscribe({
      next: (user: any) => {
        this.usuario = user;
        const cedula = user.Cedula || user.cedula;

        this.bankService.getMovimientos(cedula).subscribe({
          next: (data: any[]) => {
            this.pilaMovimientos = data.map(m => ({
              id: m.Id || m.id,
              fecha: m.Fecha || m.fecha,
              tipo: m.Tipo || m.tipo,
              monto: m.Monto || m.monto,
              saldoResultante: m.SaldoResultante || m.saldoResultante
            })).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: () => this.cargando = false
        });
      },
      error: () => this.cargando = false
    });
  }
}