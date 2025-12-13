import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { QRCodeComponent } from 'angularx-qrcode'; // ⚠️ Importa el módulo del QR
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { Usuario } from '../../entidades/Usuario';

@Component({
  selector: 'app-credencial',
  standalone: true,
  imports: [ CommonModule, QRCodeComponent],
  templateUrl: './credencial.component.html',
  styleUrl: './credencial.component.scss'
})
export class CredencialComponent {
  @Input() nombre!: string;
  @Input() apellido!: string;
  @Input() dni!: string;
  @Input() credencial!: string;
  @Input() telefono!: string;
  @Input() email!: string;
  token: string = ''; 
  
  qrData!: string;

  constructor (api: ConsultasBackServiceService) {
    const afiliadoData = sessionStorage.getItem('user');
    if (afiliadoData) {
      const pacienteObj = JSON.parse(afiliadoData); // Parsear el JSON
      console.info("id: ", pacienteObj.dni)
      api.getPacienteById(pacienteObj.dni).subscribe( (response) => {
        console.info("paciente response: ", response[0])
        const usuarioResponse = response[0]
        this.nombre = usuarioResponse.nombre.toString();
        this.apellido = usuarioResponse.apellido.toString();
        this.dni = usuarioResponse.dni!.toString();
        this.credencial = usuarioResponse.credencial;
        this.telefono = usuarioResponse.telefono!.toString();
        this.email = usuarioResponse.email.toString();
      })
    }
  }

  ngOnInit(): void {
    this.token = this.generateToken().toString(); 
    this.qrData = `DNI:${this.dni}|Credencial:${this.credencial}|Token:${this.token}`;

  }

  generateToken(): number {
    return Math.floor(10000 + Math.random() * 90000);
  }

    getQrData() {
    return JSON.stringify({
      nombre: this.nombre,
      apellido: this.apellido,
      dni: this.dni,
      credencial: this.credencial,
      telefono: this.telefono,
      email: this.email,
      token: this.token
    });
  }


}
