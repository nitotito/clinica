import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SourceTextModule } from 'vm';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { Usuario } from '../../entidades/Usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

   public confirmacontra :String= '';
   public confirmaemail:String='';
  public usuario:Usuario={
    tipoUsuario:'',
      email:'', 
      dni:null, 
      nombre:'',
      apellido:'',
      telefono:null,
      contra:'',
      especialidad:'',
      credencial:'',
      matricula:'',
 }
  registraUsuario() { // funcion registra usuario
    if (this.usuario.contra != this.confirmacontra || this.usuario.email != this.confirmaemail) {
      console.error("Por favor verifique los datos ingresados");
    }
    this.consultaBackApi.registrar(this.usuario).subscribe()// llamo a lo que ya esta
    
    
  }
  constructor(private consultaBackApi: ConsultasBackServiceService) {  // INSTANCIO MI CLASE DE BACK PARA TODOS LOS OOPERADORES

  }
 
}
