import { Component } from '@angular/core';
import { MedicosPipe } from '../../pipes/medicos.pipe'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { Medico } from '../../entidades/Medico';


@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [MedicosPipe,CommonModule,FormsModule],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})


export class AdministradorComponent {
  public filtro:String ="";
  public datoUsuario:any = sessionStorage.getItem('user');
  public datoU:any;
 
  
  medico: Medico= {
    email:'', 
    dni:null, 
    nombre:'',
    apellido:'',
    telefono:null,
    contra:'',
    especialidad:'',
    matricula:'',
    habilitacion:''
  }
  public medicos: Medico[] = [];

  constructor(public backservice:ConsultasBackServiceService){
  /*   backservice.getMedicos().subscribe(
      (consultaMedico:Medico[]) =>{
        this.medicos = consultaMedico;

      }
    );
 */
  };
  
  ngOnInit() {
    this.obtenerMedicos();
    this.obtenerDato();
  }

 public obtenerMedicos() {
    this.backservice.getMedicos().subscribe(
      (consultaMedico: Medico[]) => {
        this.medicos = consultaMedico;
      }
    );
  }

public obtenerDato() {
    this.datoU = JSON.parse(this.datoUsuario);
    console.log("datos : " + this.datoUsuario);
  }


/*    public obtenerDato(){
 
  this.datoU = JSON.parse(this.datoUsuario);
 console.log("datos : " + this.datoU.nombre);
 }   */


 
 accion(medico: any) {
  console.log("medico : " + JSON.stringify(this.medico));

this.backservice.updateMedico(medico).subscribe(
      updatedMedico => {
        console.log("Medico actualizado:", updatedMedico);
      },
      error => {
        console.error("Error actualizando médico:", error);
      }
    );
    (medico.habilitacion== "true") ? medico.habilitacion ="false" : medico.habilitacion ="true";

  medico.color = medico.color === 'red' ? 'green' : 'red';
  medico.glow = true;
  //setTimeout(() => medico.glow = false, 100000);
}
      
}
