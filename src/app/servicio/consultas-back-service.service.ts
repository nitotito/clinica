import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../entidades/Usuario';
import { loginUser } from '../entidades/loginUser';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { Medico } from '../entidades/Medico';
import { Disponibilidad } from '../entidades/Disponibilidad';

@Injectable({
  providedIn: 'root'
})
export class ConsultasBackServiceService {

  // varirar entre correr el back local o en nube
   private APIURL: string = "https://nitotito-clienteapi.mdbgo.io";
  // private APIURL: string = "http://localhost:3000";

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

  public getAvailability(specialty: String): Observable<Disponibilidad[]> {
    return this.http.get<Disponibilidad[]>(`${this.APIURL}/disponibilidadPorEsp/${specialty}`)
      .pipe(
        catchError(this.handleError) // Añadir manejo de errores
      );
  }

  guardarTurno(turno: { id_paciente: any; id_medico: any;  especialidad: string | null; fecha: string | null; hora: string | null; }): Observable<any> {
    return this.http.post<any>(`${this.APIURL}/guardarTurno`, turno);
  }

  getHour(id_medico: number, fecha: string): Observable<any[]> {
    const url = `${this.APIURL}/turnosTomados?medicoId=${id_medico}&dia=${fecha}`;
    return this.http.get<any>(url);
  }

  getHistorialTurnos(id_paciente: number, opcion: number): Observable<any[]> {
    const url = `${this.APIURL}/historialTurnos/${id_paciente}?opcion=${opcion}`;
    return this.http.get<any>(url);
  }

  getHistorialTurnosMed(id_medico: number): Observable<any[]> {
    const url = `${this.APIURL}/historialTurnosMed/${id_medico}`;
    return this.http.get<any>(url);
  }

  sendCalification(calificacionn: any): Observable<any[]> {
    const url = `${this.APIURL}/enviarCalificacion`;
    const body = calificacionn;
    return this.http.post<any>(url, body);
  }

  getCalificacionesPorAfiliado(id_paciente: number): Observable<any[]> {
    const url = `${this.APIURL}/calificaciones?id_paciente=${id_paciente}`;
    console.log("url completa : ", url);
    return this.http.get<any[]>(url);
  }

  getTurnosPaciente(dni_medico: any): Observable<any[]> {
    const url = `${this.APIURL}/turnosTomadosCSV?dni_medico=${dni_medico}`;
    console.log("dni_medico : ", dni_medico);
    return this.http.get<any[]>(url);
  }

  getMedicoById(id_medico: number): Observable<any[]> {
    const url = `${this.APIURL}/medicosById?id_medico=${id_medico}`;
    return this.http.get<Medico[]>(url);
  }

  guardarDisponibilidad(disponibilidad: any): Observable<any[]> {
    console.log("disponibilidad", disponibilidad);
    return this.http.post<any>(`${this.APIURL}/guardarDisponibilidad`, disponibilidad);
  }

  updateTurno(id: any,option: any){
    console.log("update turno", id +"---"+ option);
    
    return this.http.put(`${this.APIURL}/updateTurno?id=${id}&option=${option}`,null);
  }

  public updateObservaciones(id: any,turno: any){
    return this.http.put(`${this.APIURL}/updateObservaciones/${id}`,turno);
  }

  // Función que manejará los errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o red
      errorMessage = `Error del lado del cliente o red: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error del servidor: ${error.status}\nMensaje: ${error.message}`;
    }
    // Muestra el error por consola (opcionalmente podrías mostrarlo en la UI)
    console.error(errorMessage);
    
    // Retornar un observable con un mensaje de error personalizado para que el suscriptor pueda manejarlo
    return throwError(() => new Error('Hubo un problema con la solicitud. Intenta nuevamente más tarde.'));
  }

}
