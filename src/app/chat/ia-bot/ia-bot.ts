import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IaService } from '../ia';
import { ChangeDetectorRef } from '@angular/core';

interface Mensaje {
  texto: string;
  sender: 'user' | 'bot';
  fecha: Date;
}

@Component({
  selector: 'app-ia-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ia-bot.html',
  styleUrls: ['./ia-bot.css']
})

export class IaBot {
  private iaService = inject(IaService);
  private cdr = inject(ChangeDetectorRef); 
  
  nuevoMensaje: string = '';
  chatLog: Mensaje[] = [
    { texto: '¡Hola! Soy tu asistente bancario inteligente. ¿En qué puedo ayudarte hoy?', sender: 'bot', fecha: new Date() }
  ];
  isTyping: boolean = false;

  enviar() {
    if (!this.nuevoMensaje.trim()) return;

    const userMsg: Mensaje = { texto: this.nuevoMensaje, sender: 'user', fecha: new Date() };
    this.chatLog.push(userMsg);
    
    const promptBackup = this.nuevoMensaje;
    this.nuevoMensaje = '';
    this.isTyping = true;

    this.iaService.enviarConsulta(promptBackup).subscribe({
      next: (res) => {
        // 3. Agregamos el mensaje del bot
        this.chatLog.push({ 
          texto: res.respuesta, 
          sender: 'bot', 
          fecha: new Date() 
        });
        
        this.isTyping = false;
        
        // 4. FORZAR LA ACTUALIZACIÓN DE LA PANTALLA
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error:", err);
        this.chatLog.push({ 
          texto: 'Lo siento, hubo un error.', 
          sender: 'bot', 
          fecha: new Date() 
        });
        this.isTyping = false;
        this.cdr.detectChanges(); // También aquí por si acaso
      }
    });
  }
}