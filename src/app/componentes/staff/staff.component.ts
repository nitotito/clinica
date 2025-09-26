import { CommonModule } from '@angular/common';
import { Component , OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { loginUser } from '../../entidades/loginUser';
import { Usuario } from '../../entidades/Usuario';
import { NotificacionService } from '../../servicio/notificacion.service';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent implements OnInit {
   loginForm!: FormGroup;
   loginVisible = false;
  isLoading: boolean = false;
  public usuarioEncontrado = true; 

  public usuario:Usuario={ 
      id:null,
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
        avatar:''
   }

  loginUsuario: loginUser = {
      id: null,
      dni: null,
      contra: '',
      tipoUsuario:'',
      habilitacion:'',
      nombre:'',
    }

  constructor(private root: Router , private consultaBackApi: ConsultasBackServiceService, private fb: FormBuilder, private notifService: NotificacionService) {}

 ngOnInit(): void {
     this.loginForm = this.fb.group({
       dni: ['', [Validators.required, Validators.minLength(8)]],
       password: ['', [Validators.required]],
       tipoUsuario: ['', Validators.required]
     });
     setTimeout(() => {
      this.loginVisible = true;
    }, 100);
   }

  onLogin() {

    const formValue = this.loginForm.value;

    this.loginUsuario.dni = formValue.dni;
    this.loginUsuario.contra = formValue.password;
    this.loginUsuario.tipoUsuario = formValue.tipoUsuario;

     this.consultaBackApi.login(this.loginUsuario).subscribe(
       (consultausuario:loginUser[]) =>{   
          console.log("consulta uysuariuo : ", consultausuario);
          if(consultausuario.length == 0 || consultausuario[0].dni == null ) {
            this.notifService.mostrarError('Usuario inexistente');
            console.error ("Usuario inexistente");
            this.usuarioEncontrado = false; 
            return; 
          }else{ 
           console.log("id de consulta : ", consultausuario[0])
           this.loginUsuario.id = consultausuario[0].id;
           this.loginUsuario.nombre = consultausuario[0].nombre;
           this.loginUsuario.contra = consultausuario[0].contra;
           sessionStorage.setItem('user',JSON.stringify(this.loginUsuario));
           let tipoUser = this.loginUsuario.tipoUsuario;
           console.log("hoal",consultausuario[0])

            switch(tipoUser){
              case "medico":
                if(consultausuario[0].habilitacion == "false"){
                  let email = 'administracion@ClinicaSalud.com';
                  let subject = 'Habilitacion para turnos';
                  let outlookUrl = `https://outlook.live.com/owa/?path=/mail/action/compose&to=${email}&subject=${encodeURIComponent(subject)}`;
    
                  sessionStorage.removeItem("user");
                  this.notifService.mostrarError("Usuario no habilitado, contacte con el administrador");
                  window.location.href = outlookUrl; 
                }else{
                  this.root.navigateByUrl("/medico");      
                }  
                break;
              case "administrativo":
                this.root.navigateByUrl("/admin");
                break;
            } 
          } 
          
          }
        );
  }
}

