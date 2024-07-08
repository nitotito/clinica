import { CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { FormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  public usuarioEncontrado = true; 
  
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
    habilitacion:'',
    nombre:'',
  }

  constructor(private consultaBackApi: ConsultasBackServiceService ,private root:Router, private fb: FormBuilder) {  // INSTANCIO MI CLASE DE BACK PARA TODOS LOS OOPERADORES

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required]],
      tipoUsuario: ['']
    });
  }

 public login(){
  if(this.loginForm.valid){

    this.loginUsuario.dni = this.loginForm.value.dni;
    this.loginUsuario.contra = this.loginForm.value.password;
    this.loginUsuario.tipoUsuario = this.loginForm.value.tipoUsuario;

  this.consultaBackApi.login(this.loginUsuario).subscribe(
    
    (consultausuario:loginUser[]) =>{   
      if(consultausuario.length == 0 || consultausuario[0].dni == null ) {
        console.error ("Usuario inexistente");
        this.usuarioEncontrado = false; 
        return; 
      }else{ 
       console.log("usuario ingresando: "+ consultausuario[0].tipoUsuario);
       console.log("usuario : " + JSON.stringify(consultausuario[0].nombre));
       let tipoUser = this.loginUsuario.tipoUsuario;
       this.loginUsuario.nombre = consultausuario[0].nombre;
       sessionStorage.setItem('user',JSON.stringify(this.loginUsuario));

        switch(tipoUser){
          case "Paciente":
            this.root.navigateByUrl("/afiliado");
            break;
          case "medico":
            console.log(" this habitacion : " + consultausuario[0]);
            console.log(" this habitacion : " + consultausuario[0].habilitacion );
            if(consultausuario[0].habilitacion == "false"){
              let email = 'administracion@ClinicaSalud.com';
              let subject = 'Habilitacion para turnos';
              let outlookUrl = `https://outlook.live.com/owa/?path=/mail/action/compose&to=${email}&subject=${encodeURIComponent(subject)}`;

              sessionStorage.removeItem("user");
              alert("Usuario no habilitado, contacte con el administrador");
              window.location.href = outlookUrl; 
            }else{
              this.root.navigateByUrl("/medico");        
            }  
            break;
          case "admin":
            this.root.navigateByUrl("/admin");
            break;
        }
      } 
      
      }
    );
  }else{
    this.markFormGroupTouched(this.loginForm);
  }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: FormGroup<any>) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}