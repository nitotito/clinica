import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Obtener token desde la URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword(): void {
    if (this.password !== this.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    this.http.post(`http://localhost:8080/auth/reset-password?token=${this.token}`, { password: this.password })
      .subscribe({
        next: () => {
          alert("Contraseña actualizada con éxito");
          this.router.navigate(['/login']);
        },
        error: err => {
          const backendMessage = err.error?.mensaje || "Error inesperado";
          alert("Error al actualizar contraseña: " + backendMessage);
        }
      });
  }
}
