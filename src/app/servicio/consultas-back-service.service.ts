import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../entidades/Usuario';
import { loginUser } from '../entidades/loginUser';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultasBackServiceService {

  private APIURL: string = "https://nitotito-clienteapi.mdbgo.io";


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
