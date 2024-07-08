import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../entidades/Usuario';
import { loginUser } from '../entidades/loginUser';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { Medico } from '../entidades/Medico';

@Injectable({
  providedIn: 'root'
})
export class ConsultasBackServiceService {

  // varirar entre correr el back local o en nube
    private APIURL: string = "https://nitotito-clienteapi.mdbgo.io";
    //private APIURL: string = "http://localhost:3000";

  constructor(public http: HttpClient) { }


  public registrar(usuario:Usuario) {
    return this.http.post(this.APIURL + "/insertar", usuario)
/*     .pipe(
      catchError(this.handleError)
    ); */
  }

  public registrarMed(usuario:Usuario) {
    return this.http.post(this.APIURL + "/insertarMed", usuario);
  }

  public registrarAdmin(usuario:Usuario) {
    return this.http.post(this.APIURL + "/insertarAdmin", usuario);
  }
  

  public login(loginUsuario:any):Observable<loginUser[]>{
    /* console.log(this.APIURL+"/login") */
    return this.http.post<loginUser[]>(`${this.APIURL}/login`, loginUsuario);
    
  }

  public getPac(id:Number){
    console.log(this.APIURL+"/loguear")
    return this.http.get(this.APIURL + "/getPaciente/" + id);
    
  }
  public getMedicos(){
    console.log(this.APIURL+"/medicos")
    return this.http.get<Medico[]>(this.APIURL + "/medicos/");    
  }

  public updateMedico(medico: Medico){
    const url = `${this.APIURL+"/medicos"}`;
    return this.http.put(url, medico);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido!';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error del servidor: ${error.status}\nMensaje: ${error.message}`;
      if (error.status === 400) {
        errorMessage = 'El correo ya está registrado.';
      }
    }
    return throwError(errorMessage);
  }

}
