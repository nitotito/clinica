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
import { NotificacionService } from '../../servicio/notificacion.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
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
      avatar:'',
      dniTitular: 0,
    parentesco: ''
 }

  loginUsuario: loginUser = {
    id: null,
    dni: null,
    contra: '',
    tipoUsuario:'Paciente',
    habilitacion:'',
    nombre:'',
  }

  constructor(private consultaBackApi: ConsultasBackServiceService ,private root:Router, private fb: FormBuilder, private notifService: NotificacionService) {  // INSTANCIO MI CLASE DE BACK PARA TODOS LOS OOPERADORES

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required]],
      tipoUsuario: ['Paciente']
    });
  }

 public login(){
  this.isLoading = true; 
  if(this.loginForm.valid){
    this.loginUsuario.dni = this.loginForm.value.dni;
    this.loginUsuario.contra = this.loginForm.value.password;
    this.loginUsuario.tipoUsuario = this.loginForm.value.tipoUsuario;
    console.log("tipo usuario :", this.loginUsuario.tipoUsuario);
    console.log("valor de isloading: ", this.isLoading);
   this.consultaBackApi.login(this.loginUsuario).subscribe({
    next: (consultausuario: loginUser[]) => {
      if (!consultausuario || consultausuario.length === 0 || !consultausuario[0]?.dni) {
        console.log("Usuario inexistente");
        this.usuarioEncontrado = false;
        return;
      }

      const user = consultausuario[0];
      console.log("Usuario encontrado:", user);

      this.loginUsuario.id = user.id;
      this.loginUsuario.nombre = user.nombre;
      sessionStorage.setItem('user', JSON.stringify(this.loginUsuario));

      this.root.navigateByUrl("/afiliado");
    },
    error: err => {
      console.error("Error en login:", err);
      this.notifService.mostrarError("Usuario inexistente");
      this.usuarioEncontrado = false;
    }
  });
    setTimeout(() => {
      this.isLoading = false; 
    }, 400); 
  }else{ 
    this.isLoading = false; 
    this.markFormGroupTouched(this.loginForm);
  }
  }

      openForgotPassword() {
      const email = prompt("Ingrese su correo para recuperar la contraseña");

      if (email) {
        this.consultaBackApi.forgotPassword(email).subscribe({
          next: (res) => {
            this.notifService.mostrarExito("Si el email existe, recibirás un correo con instrucciones");
          },
          error: (err) => {
            console.error("Error en recuperación:", err);
            this.notifService.mostrarError("Hubo un error, intente más tarde");
          }
        });
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
  ngAfterViewInit() {
    setTimeout(() => {
        const perfilElement = document.querySelector('.perfil');
        perfilElement?.classList.add('visible');
    }, 100); // Espera 100ms para asegurar que el elemento esté en el DOM
  }
}