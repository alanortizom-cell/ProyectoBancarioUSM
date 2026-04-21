import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
  nombre: ['', Validators.required],
  apellido: ['', Validators.required], 
  cedula: ['', Validators.required],
  password: ['', [Validators.required, Validators.minLength(6)]],
  saldoInicial: [0, Validators.required],
  tieneCuenta: [false]
});

  errorMsg: string = '';

  onRegister() {
  if (this.registerForm.invalid) return;

  const datosRegistro = {
    nombre: this.registerForm.value.nombre,
    apellido: this.registerForm.value.apellido,
    cedula: this.registerForm.value.cedula,
    password: this.registerForm.value.password,
    tieneCuenta: this.registerForm.value.tieneCuenta,
    numeroCuenta: this.registerForm.value.tieneCuenta ? this.registerForm.value.numeroCuenta : null, 
    saldoInicial: 0
  };

  this.authService.register(datosRegistro).subscribe({
    next: () => {
      alert('¡Usuario creado con éxito!');
      this.router.navigate(['/login']);
    },
    error: (err) => console.error(err)
  });
}
}