import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Cajeros } from './bank/cajeros/cajeros';
import { authGuard } from './auth/auth-guard';
import { MovimientosComponent } from './bank/movimientos/movimientos';
import { IaBot } from './chat/ia-bot/ia-bot';
import { MonitorTurnos } from './components/monitor-turnos/monitor-turnos';
import { GestionCajero } from './components/gestion-cajero/gestion-cajero';
import { UsuarioTicket } from './components/usuario-ticket/usuario-ticket';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'bank/cajeros', component: Cajeros, canActivate: [authGuard] },
  { path: 'bank/movimientos', component: MovimientosComponent, canActivate: [authGuard] },
  { path: 'chat', component: IaBot, canActivate: [authGuard] },
  { path: 'cajero/:id', component: GestionCajero }, // El :id será el número del 1 al 5
  { path: 'monitor', component: MonitorTurnos },
  { path: 'mi-ticket/:id', component: UsuarioTicket },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];