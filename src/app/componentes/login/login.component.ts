import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { loginUser } from '../../entidades/loginUser';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { Usuario } from '../../entidades/Usuario';
//import { error } from 'console';
import { dataToken } from '../../entidades/loginResponse';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

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

  loginUsuario: loginUser = {
    dni: null,
    contra: '',
    tipoUsuario:'admin',
    habilitacion:''
  }

  constructor(private consultaBackApi: ConsultasBackServiceService ,private root:Router) {  // INSTANCIO MI CLASE DE BACK PARA TODOS LOS OOPERADORES

  }

 public login(){
  this.consultaBackApi.login(this.loginUsuario).subscribe(
    
    (consultausuario:loginUser[]) =>{
      console.log("usuario : " + JSON.stringify(consultausuario));
      let tipoUser = this.loginUsuario.tipoUsuario;
      if(consultausuario[0].dni == null ) {
        console.error ("Usuario inexistente");

      }else{ 
       sessionStorage.setItem('user',JSON.stringify(this.loginUsuario));
        switch(tipoUser){
          case "Paciente":
            this.root.navigateByUrl("/afiliado");
            break;
          case "medico":
            console.log(" this habitacion : " + consultausuario[0]);
            console.log(" this habitacion : " + consultausuario[0].habilitacion );
            if(consultausuario[0].habilitacion == "false"){
              sessionStorage.removeItem("user");
              alert("Usuario no habilitado");
            }else{
              this.root.navigateByUrl("/medico");
            }  
            break;
          case "admin":
            this.root.navigateByUrl("/admin");
            break;
        }
      } // casteo la consultausuario al objeto logiUser 
      
      }
    )

  }

}