import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private _mensaje = new BehaviorSubject<{ tipo: 'success' | 'error', texto: string } | null>(null);
  mensaje$ = this._mensaje.asObservable();

  mostrarExito(texto: string) {
    console.log('Notificación EXITO:', texto);
    this._mensaje.next({ tipo: 'success', texto });
    this.autoOcultar();
  }

  mostrarError(texto: string) {
    console.log('Notificación ERROR:', texto); 
    this._mensaje.next({ tipo: 'error', texto });
    this.autoOcultar();
  }

  private autoOcultar() {
    setTimeout(() => this._mensaje.next(null), 3000); // 3s y se oculta
  }
}