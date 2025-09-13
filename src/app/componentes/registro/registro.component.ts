import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { SourceTextModule } from 'vm';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { Usuario } from '../../entidades/Usuario';
import { RouterModule ,Router } from '@angular/router';
import { loginUser } from '../../entidades/loginUser';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  public confirmacontra: String = '';
  public confirmaemail: String = '';
  public validar: String = "";
  public respo: any = "";
  public usuario: Usuario = {
    id: null,
    tipoUsuario: 'Paciente',
    email: '',
    dni: null,
    nombre: '',
    apellido: '',
    telefono: null,
    contra: '',
    especialidad: '',
    credencial: '',
    matricula: '',
    avatar: ''
  }

  // constructor
  constructor(private consultaBackApi: ConsultasBackServiceService, private root: Router) {  // INSTANCIO MI CLASE DE BACK PARA TODOS LOS OOPERADORES

  }

  /* 
   Funcion que registra los distintos tipos de usuario
  */
  public registraUsuario() {

    var campos = this.validarCampos();

    console.log("valor de campos : " + campos);
    console.log("valor de validador : " + this.validar);
    console.log("valor de campo : " + campos);

    if (campos == true) {
      console.log("Tipo de usuario : " + this.usuario.tipoUsuario);
      /* if (this.usuario.tipoUsuario == "medico") {
        this.consultaBackApi.registrarMed(this.usuario).subscribe(response => {
          this.respuestaApi(response);});
      } else if (this.usuario.tipoUsuario == "Paciente") { */
      console.log("registrando paciente");
      this.consultaBackApi.registrar(this.usuario).subscribe((response: any) => {
        console.log("repsonse ;: ", response)
        if (response == 'ok') {
          sessionStorage.setItem('user', JSON.stringify(this.usuario));
          console.log("Registro exitoso");
          this.root.navigateByUrl("/afiliado");
           console.log("Registro exitoso 2 ");
        } else {
          console.error("Error en registro");
        }
      });

      /* } */
    } else if (this.validar != "admin") {
      console.log("campos no validos");
    } else {
      console.log("Esta intentando ingresar como admin");
    }
  }




  /* 
   Funcion para validar campos
  */
  public validarCampos() {
    if (this.validar == "admin") {
      console.log("validado retorna false");
      return false;
    }
    console.log("primer ingreso no valida : " + this.validar);
    let admin = this.validarIngresoAdmin();

    if (admin == true) {
      this.validar = "admin";
      return false;
    }
    if (this.usuario.nombre == "" || this.usuario.apellido == "" || this.usuario.dni == null || this.usuario.telefono == null) {
      this.validar = "vacio";
      return false;
    } else {
      this.validar = "lleno";
    }

    if (String(this.usuario.dni).length != 8) {
      this.validar = "falta";
      return false;
    } else {
      this.validar = "lleno";
    }

    if (this.usuario.contra == "" || this.usuario.email == "") {
      this.validar = "vacio";
      return false;
    } else {
      this.validar = "lleno";
    }
    if (this.usuario.contra != this.confirmacontra) {
      console.error("Por favor verifique los datos ingresados");
      this.validar = "contr";
      return false;
    } else {
      this.validar == "lleno";
    }

    if (this.usuario.email != this.confirmaemail) {
      console.error("Por favor verifique los datos ingresados");
      this.validar = "email";
      return false;
    } else {
      this.validar = "lleno";
    }

    console.log("Todos los campos estan ok");
    return true;

  }

  public validarIngresoAdmin() {
    if (this.usuario.nombre == "admin" && this.usuario.apellido == "admin" && this.usuario.contra == "admin") {
      console.warn("ingreso admin");
      window.alert("Primer registro Admin");
      return true;
    } else {
      return false;
    }
  }

  /* 
  funcion que valida los distintos tipos de respuesta de la api
  */

  private respuestaApi(response: any) {

    switch (response) {
      case 400:
        console.error("Usuario existente");
        window.alert('Usuario existente');
        break;
      case 500:
        console.error("Error en bd");
        window.alert('Error. Reintente');
        break;
      case 300:
        console.error("Administradir unico ya ingresado");
        window.alert('Administrador ya ingresado.');
        this.root.navigateByUrl("/error");
        break;
      case "okadmin":
        console.log("Registro exitoso de admin");
        this.root.navigateByUrl("/");
        sessionStorage.setItem('user', JSON.stringify(this.usuario));
        break;
      case "okmedico":
        console.log("Registro exitoso de medico");
        this.root.navigateByUrl("/medico");
        sessionStorage.setItem('user', JSON.stringify(this.usuario));
        break;
    }
  }

  public registraAdmin() {
    console.log(String(this.usuario));
    console.log("Registrando Admin");
    this.consultaBackApi.registrarAdmin(this.usuario).subscribe(response => {
      console.log("respuesta : " + String(response));
      this.respuestaApi(response);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const perfilElement = document.querySelector('.perfil');
      perfilElement?.classList.add('visible');
    }, 100); // Espera 100ms para asegurar que el elemento esté en el DOM
  }


}
