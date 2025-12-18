import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotificacionService } from '../../servicio/notificacion.service';

@Component({
  selector: 'app-reset-password',
  standalone:true,
  templateUrl: './reset-password.component.html',
  imports: [ FormsModule],
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  password: string = '';
  confirmPassword: string = '';
  token: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private notifService: NotificacionService) {}

  ngOnInit(): void {
    // Obtener token desde la URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword(): void {
    if (!this.password || !this.confirmPassword) {
    this.notifService.mostrarError('La contraseña es obligatoria.');
    return;
  }

  if (this.password !== this.confirmPassword) {
    this.notifService.mostrarError('Las contraseñas no coinciden.');
    return;
  }

  if (this.password.length < 8) {
    this.notifService.mostrarError('La contraseña debe tener al menos 8 caracteres.');
    return;
  }

  const regexEspecial = new RegExp('[!@#$%^&*(),.?":{}|<>]');;
  if (!regexEspecial.test(this.password)) {
    this.notifService.mostrarError('La contraseña debe contener al menos un carácter especial.');
    return;
  }

    this.http.post(`http://localhost:8080/auth/reset-password?token=${this.token}`, { password: this.password })
      .subscribe({
        next: () => {
          this.notifService.mostrarExito('Contraseña actualizada con exito');
          this.router.navigate(['/login']);
        },
        error: err => {
          const backendMessage = err.error?.mensaje || "Error inesperado";
          this.notifService.mostrarError("Error al actualizar contraseña: " + backendMessage);
        }
      });
  }
}
