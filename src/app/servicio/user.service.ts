import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../entidades/Usuario'; 
import { Medico } from '../entidades/Medico';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //private APIURL: string = "https://nitotito-clienteapi.mdbgo.io";
  // private APIURL = 'http://localhost:3000'; 
  //Nuevo servicio en JAVA

   private APIURL: string = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  updateUserProfile(usuario: Usuario): Observable<any> {
    console.log("usuario : " , usuario);
    return this.http.put(`${this.APIURL}/pacientes/${usuario.id}`, usuario); 
  }

  updateMedicProfile(medico: Medico): Observable<any> {
    console.log("medico : " , medico);
    return this.http.put(`${this.APIURL}/medicos/${medico.id}`, medico); 
  }

  getCurrentUser(id: number): Observable<any>{
    return this.http.get(`${this.APIURL}/pacienteId/${id}`);
  }
}