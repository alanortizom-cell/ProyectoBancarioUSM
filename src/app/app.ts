import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { NavbarComponent } from "./shared/navbar/navbar";
// Importa aquí tu componente Navbar
// import { NavbarComponent } from './components/navbar/navbar'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet /* , NavbarComponent */, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private router = inject(Router);
  mostrarNavbar: boolean = false;

  ngOnInit() {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe((event: any) => {
    const url = event.urlAfterRedirects;

    // 1. Lista de rutas fijas (coincidencia exacta)
    const rutasFijasSinNavbar = ['/login', '/register', '/'];
    
    // 2. Comprobamos coincidencias exactas
    const esRutaFija = rutasFijasSinNavbar.includes(url);

    // 3. Comprobamos rutas dinámicas (que empiecen por...)
    const esGestionCajero = url.startsWith('/cajero/');

    // Si es cualquiera de las dos, ocultamos (false)
    this.mostrarNavbar = !(esRutaFija || esGestionCajero);
  });
}
}