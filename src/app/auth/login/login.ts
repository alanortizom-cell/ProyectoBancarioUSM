import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth'; 
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  // Propiedades vinculadas al HTML
  cedula: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false; 

  // Inyección de servicios
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
  this.errorMessage = '';
  
  if (!this.cedula.trim() || !this.password.trim()) {
    this.errorMessage = 'Debes completar todos los campos';
    return;
  }

  this.isLoading = true;

  // El pipe finalize garantiza que isLoading vuelva a false pase lo que pase
  this.authService.login(this.cedula, this.password)
    .pipe(
      finalize(() => this.isLoading = false) 
    )
    .subscribe({
      next: (response) => {
        if (response && response.Token) {
          localStorage.setItem('token', response.Token);
          this.router.navigate(['/bank/cajeros']);
        }
      },
      error: (err) => {
        console.log('Error detectado en componente:', err);
        if (err.status === 401) {
          this.errorMessage = err.error?.message || 'Cédula o contraseña incorrectas';
        } else if (err.status === 0) {
          this.errorMessage = 'No hay conexión con el servidor.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado.';
        }
      }
    });
}
}