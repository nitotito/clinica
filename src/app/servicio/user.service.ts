import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../entidades/Usuario'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private APIURL: string = "https://nitotito-clienteapi.mdbgo.io";
  //private APIURL = 'http://localhost:3000'; // Cambia esto por tu endpoint

  constructor(private http: HttpClient) {}

  updateUserProfile(usuario: Usuario): Observable<any> {
    return this.http.put(`${this.APIURL}/usuarios/${usuario.id}`, usuario); 
  }

  getCurrentUser(id: number): Observable<any>{
    return this.http.get(`${this.APIURL}/pacienteId/${id}`);
  }
}