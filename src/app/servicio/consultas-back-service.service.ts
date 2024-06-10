import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../entidades/Usuario';
import { loginUser } from '../entidades/loginUser';

@Injectable({
  providedIn: 'root'
})
export class ConsultasBackServiceService {

  private APIURL: string = "http://localhost:3000";


  constructor(public http: HttpClient) { }


  public registrar(usuario:Usuario) {
    return this.http.post(this.APIURL + "/insertar", usuario);
  }
  public login(loginUsuario:loginUser){
    console.log(this.APIURL+"/loguear")
    return this.http.post(this.APIURL + "/loguear", loginUsuario);
    
  }

}
