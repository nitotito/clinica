import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { PrincipalComponent } from '../principal/principal.component';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../entidades/Usuario';
import { loginUser } from '../../entidades/loginUser';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  public ret:boolean = false;

  public user:loginUser = {
  id: null,
  dni: null,
  contra:'',
  tipoUsuario:'',
  habilitacion:'',
  nombre:''
}

 public isLoggedIn(): boolean {
    const accessToken = sessionStorage.getItem('user');
    if(accessToken != null){
      this.user =JSON.parse(accessToken);
      //console.log("usuario ingresando : " + this.user.tipoUsuario);
    }
    
   // console.log(" content : " + !!accessToken);
    return !!accessToken;
  }

 public cerrarSesion(): void {
    sessionStorage.removeItem('user');
    console.log("this : " + sessionStorage.getItem('user'));
  }

}
