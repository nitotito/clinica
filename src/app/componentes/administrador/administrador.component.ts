import { Component } from '@angular/core';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})
export class AdministradorComponent {
  public datoUsuario:any = localStorage.getItem('usuario');
  public datoU:any;
 
   public obtenerDato(){
 
  this.datoU = JSON.parse(this.datoUsuario);
 console.log("datos : " + this.datoU.nombre);
 }  
      
}
