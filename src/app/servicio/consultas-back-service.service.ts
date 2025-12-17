import { HttpClient,HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../entidades/Usuario';
import { loginUser } from '../entidades/loginUser';
import { Observable, catchError, map, of} from 'rxjs';
import { throwError } from 'rxjs';
import { Medico } from '../entidades/Medico';
import { Disponibilidad } from '../entidades/Disponibilidad';
import { Turno } from '../entidades/Turno';

@Injectable({
  providedIn: 'root'
})
export class ConsultasBackServiceService {

  // varirar entre correr el back local o en nube
   //private APIURL: string = "https://nitotito-clienteapi.mdbgo.io";
   //private APIURL: string = "http://localhost:3000";

   //Nuevo servicio en JAVA
   private APIURL: string = "http://localhost:8080";


  constructor(public http: HttpClient) { }


  public registrar(usuario: Usuario) {
  return this.http.post(this.APIURL + "/insertar", usuario).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error en registrar():', error);
      return throwError(() => error); 
    })
  );
}

getReporteMedico(fechaInicio: string, fechaFin: string) {
  const params = { inicio: fechaInicio, fin: fechaFin };
  console.log("ajsdhfjashdfa", params)
  return this.http.get(`${this.APIURL}/reporteMedico`, {
    params,
    responseType: 'blob'  // 👈 importante: el back devuelve un PDF (bytes)
  });
}

getReporteMedicoXDia(dia: string) {
  const params = {dia};
  console.log('🟢 Día enviado:', dia);
  console.log("params : ", params)
  return this.http.get(`${this.APIURL}/reporteMedicoXDia`, {
    params,
    responseType: 'blob' as 'json' // 👈 importante: el back devuelve un PDF (bytes)
  }) as Observable<any>;
}

getReporteTurnosCancelados(fechaInicio: string, fechaFin: string) {
  const params = { inicio: fechaInicio, fin: fechaFin };
  console.log("ajsdhfjashdfa", params)
  return this.http.get(`${this.APIURL}/reporteMedicoXCancelado`, {
    params,
    responseType: 'blob'  // 👈 importante: el back devuelve un PDF (bytes)
  });
}

  public registrarMed(usuario:Usuario) {
    return this.http.post(this.APIURL + "/insertarMed", usuario);
  }

  public registrarAdmin(usuario:Usuario) {
    return this.http.post(this.APIURL + "/insertarAdmin", usuario);
  }

    getTurnosPorFecha(fecha: string) {
    return this.http.get<Turno[]>(`${this.APIURL}/turnos/${fecha}`);
  }
  

  public login(loginUsuario:any):Observable<loginUser[]>{
    /* console.log(this.APIURL+"/login") */
    return this.http.post<loginUser[]>(`${this.APIURL}/login`, loginUsuario);
    
  }

  public getPacienteById(id:Number){
    console.log(this.APIURL+"/loguear")
    const url = `${this.APIURL}/pacienteId/${id}`;
    return this.http.get<Usuario[]>(url);
    
  }

  public getMedicos(){
    console.log(this.APIURL+"/medicos")
    return this.http.get<Medico[]>(this.APIURL + "/medicos");    
  }

  public updateMedico(medico: Medico): Observable<any> {
    console.log("medico : " , medico);
    return this.http.put(`${this.APIURL}/medicoHabilitacion/${medico.id}`, medico); 
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

  guardarDisponibilidad(disponibilidad: any): Observable<HttpResponse<any>> {
    console.log("disponibilidad", disponibilidad);
    return this.http.post<any>(`${this.APIURL}/guardarDisponibilidad`, disponibilidad,{ observe: 'response' });
  }

  updateTurno(id: any,option: any){
    console.log("update turno", id +"---"+ option);
    
    return this.http.put(`${this.APIURL}/updateTurno?id=${id}&option=${option}`,null);
  }

  updateObservaciones(id: any,turno: any){
    return this.http.put(`${this.APIURL}/updateObservaciones/${id}`,turno);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.APIURL}/auth/forgot-password`, { email });
  }

  getDisponibilidadByMedicoId(idMedico: number) {
  return this.http.get<any>(`${this.APIURL}/disponibilidad/${idMedico}`);
  }

  existeTitular(dni: number): Observable<boolean> {
    return this.http.get<any>(`${this.APIURL}/buscarPorDni/${dni}`).pipe(
      map(response => !!response), // true si existe
      catchError(() => of(false))  // false si hay error
    );
  }
  
  cancelarTurno(id: number) {
    return this.http.get(`${this.APIURL}/cancelarTurno/${id}`, {});
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
