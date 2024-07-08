import { Component } from '@angular/core';

@Component({
  selector: 'app-afiliado',
  standalone: true,
  imports: [],
  templateUrl: './afiliado.component.html',
  styleUrl: './afiliado.component.css'
})
export class AfiliadoComponent {
 public datoUsuario:any = sessionStorage.getItem('user');
 public datoU:any;

  public obtenerDato(){

 this.datoU = JSON.parse(this.datoUsuario);
console.log("datos : " + this.datoU.nombre);
}  
    
  

 
}
