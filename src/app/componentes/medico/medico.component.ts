import { Component } from '@angular/core';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.css'
})
export class MedicoComponent {

  public datoUsuario:any = localStorage.getItem('usuario');
  public datoU:any;
 
   public obtenerDato(){
 
  this.datoU = JSON.parse(this.datoUsuario);
 console.log("datos : " + this.datoU.nombre);
 }  
}
