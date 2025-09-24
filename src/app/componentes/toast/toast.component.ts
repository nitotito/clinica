// toast.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../servicio/notificacion.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  mensaje$: Observable<{ tipo: 'success' | 'error', texto: string } | null>;

  constructor(private notifService: NotificacionService) {
    this.mensaje$ = this.notifService.mensaje$;
    this.mensaje$.subscribe(msg => console.log('Toast recibe:', msg));
  }
}
