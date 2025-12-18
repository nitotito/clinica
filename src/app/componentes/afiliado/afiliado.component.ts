import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { Medico } from '../../entidades/Medico';
import { EspecialidadPipe } from '../../pipes/especialidad.pipe';
import { FormsModule } from '@angular/forms';
import { Disponibilidad } from '../../entidades/Disponibilidad';
import { Router } from '@angular/router';
import { Turno } from '../../entidades/Turno';
import { NotificacionService } from '../../servicio/notificacion.service';

@Component({
  selector: 'app-afiliado',
  standalone: true,
  imports: [CommonModule, FormsModule, EspecialidadPipe],
  templateUrl: './afiliado.component.html',
  styleUrl: './afiliado.component.css'
})
export class AfiliadoComponent {
  inputValue: string = '';
  especialidades!: string[];
  especialidadesVisible: boolean = false;
  especialidadSeleccionada: string | null = null;
  disponibilidad!: Disponibilidad;
  horasDisponibles!: string[];
  selectedDate: string | null = null;
  selectedHour: string | null = null; 
  availableDays: Date[] = []; 
  availableHours: string[] = []; 
  minDate!: string;
  maxDate!: string;
  nombrePaciente: string | null = '';
  hoursTuno: any[] = [];
  mostrarMensajeExito: boolean = false; 
  mostrarHistorial: boolean = false; 
  historialTurnos: any[] = []; 
  turnosPropios: boolean = false;
  mensajeCalificacionVisible:boolean = false;
  calificaciones: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  turnoSeleccionado: any; 
  calificacionSeleccionada: number | null = null;
  mensajeGraciasVisible: boolean = false;
  isLoading: boolean = false;
  isLoadingAux: boolean = false;
  isHasHistory: boolean = true;
  isHasTurno: boolean = true;
  hasAvailableHours: boolean = true;
  calificado : boolean = false;

  ngOnInit() {
    const afiliadoData = sessionStorage.getItem('user');
    if (afiliadoData) {
      const pacienteObj = JSON.parse(afiliadoData); // Parsear el JSON
      this.nombrePaciente = pacienteObj.nombre || 'Afiliado'; // Asignar el nombre o usar 'Afiliado' como fallback
    }
  }

  constructor(private consultaBackApi: ConsultasBackServiceService,private router: Router, private notifService: NotificacionService) { 
    const today = new Date();
    this.minDate = this.formatDate(today); // Por ejemplo, hoy
    const futureDate = new Date(today.setMonth(today.getMonth() + 2)); // Dentro de 2 meses
    this.maxDate = this.formatDate(futureDate);
  }

  // Formatear la fecha como yyyy-mm-dd para usar en min y max
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  mostrarEspecialidades() {
    console.log("this 1")
    this.clearVariablesPaciente();
    this.especialidadesVisible = true;
    this.mostrarMensajeExito = false;
    this.mostrarHistorial = false;
    this.turnosPropios = false;
    console.log("this2")
    this.getMedicos();
  }

  getMedicos() {  // busco medicos  y parseo la especialidad
    this.consultaBackApi.getMedicos().subscribe((medicos: Medico[]) => {
      console.log("daskdoaskdoasdkoasodkasodasokdoaskdoka: ", medicos)
      this.especialidades = medicos
      .filter(medico =>  medico.habilitacion)
      .map(medico => medico.especialidad);
    });
  }

  handleSelect(option: string) {
    this.inputValue = option; // Actualiza el input con la opción seleccionada
    this.especialidadSeleccionada = option; // Guarda la especialidad seleccionada
    this.getAvailability(option);
  }

  getAvailability(especialidad: string) {
    this.consultaBackApi.getAvailability(especialidad).subscribe((disponibilidad: Disponibilidad[]) => {
      console.log("disponibilidad :",  disponibilidad[0])
      this.disponibilidad = disponibilidad[0]; // Actualiza la lista de disponibilidad
      
    });
  }

  procesarDisponibilidad(disponibilidad: Disponibilidad) {
    console.log("Disponibilidad recibida:", disponibilidad);  // Agrega esto para ver toda la respuesta
    if (disponibilidad && disponibilidad.dias) {
      const daysOfWeek = String(disponibilidad.dias).split(',');
      console.log(`daysOfWeek: ${daysOfWeek}`);
      console.log("horas disponibles: ", disponibilidad.desde, " hasta " , disponibilidad.hasta)
      const hoursDoctor = this.generarHorasDisponibles(disponibilidad.desde, disponibilidad.hasta);
      const medicoId = this.disponibilidad.id_medico; 
      const diaSelect = this.selectedDate;

      if (!diaSelect) {
        console.error("La fecha seleccionada no es válida");
        return; // Salir de la función si la fecha es nula o inválida
      }
  
      this.consultaBackApi.getHour(medicoId, diaSelect).subscribe((response) => {
        this.hoursTuno = response.map(item => item.hora); 

        const getTodayDay = (): string => {
          const days = ['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'];
          const date = new Date(String(this.selectedDate)); // Convertir la cadena de fecha a un objeto Date
          const dayIndex = date.getDay(); // 0 es domingo, 1 es lunes, etc.

          return days[dayIndex];
        };
        
        console.log("daysOfWeek ", daysOfWeek);
        console.log("getTodayDay() ", getTodayDay());

        // Verificar si hoy está en la lista de días disponibles
        if(daysOfWeek.includes(getTodayDay())) {
          this.availableHours = this.removeDuplicates(hoursDoctor, this.hoursTuno);
        } else {
          this.availableHours = [];
        }

        if(this.availableHours.length == 0) {
          this.hasAvailableHours = false;
          
        } else {
          this.hasAvailableHours = true;
        }

        console.log("horas obtenidas: ", this.hoursTuno);
        console.log("horas disponibles:", hoursDoctor);
        console.log("horas final:", this.availableHours);
    
      }, (error) => {
        console.error("Error al obtener horarios:", error);
      });
    } else {
      this.notifService.mostrarError("Error al buscar disponibilidad");
      console.error("El campo 'dias' es undefined o no existe");
    }
  }

  removeDuplicates(array1: string[], array2: string[]): string[] {
    // Convertir los arrays a sets
    const set1 = new Set(array1);
    const set2 = new Set(array2);

    // Eliminar los elementos de set1 que están en set2
    array1.forEach(item => {
        if (set2.has(item)) {
            set1.delete(item);
        }
    });

    // Convertir el set resultante de nuevo a array
    return Array.from(set1);
}

/*   isHourDisabled(hour: string): boolean {
    return this.hoursTuno.includes(hour);
  }
 */
  // Función para deshabilitar días no disponibles
  disableInvalidDays(event: KeyboardEvent) {
    const inputDate = new Date(this.selectedDate!); // hace que no tome la fecha del dia anterior a hoy 
    this.availableDays = this.generarDiasDisponibles(["LU","JU"]); // Generamos los días del mes
    // Verificar si la fecha seleccionada está dentro de los días disponibles
    const isAvailable = this.availableDays.some((availableDay) => {
      return availableDay.toDateString() === inputDate.toDateString();
    });

    if (!isAvailable) {
      this.notifService.mostrarError('El día seleccionado no está disponible. Por favor elige otro día.');
      event.preventDefault(); // Evitar que seleccione el día no permitido
      this.selectedDate = null; // Reiniciar el valor
    }
  }

  onDateSelect() {
    // Lógica adicional cuando se selecciona una fecha
    console.log(`Fecha seleccionada: ${this.selectedDate}`);
    this.selectedHour = null; // Reiniciar la selección de hora al cambiar de día
    this.procesarDisponibilidad(this.disponibilidad);
  }

  // Genera los días del mes que coinciden con los días de la semana disponibles
  generarDiasDisponibles(diasDisponibles: string[]): Date[] {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 30); // Rango de 30 días
    const days: Date[] = [];

    for (let day = today; day <= end; day.setDate(day.getDate() + 1)) {
      const dayName = this.getDayName(day);
      if (diasDisponibles.includes(dayName)) {
        days.push(new Date(day)); // Agregamos el día disponible
      }
    }
    return days;
  }

  // Devuelve el nombre del día de la semana (e.g., "L", "M", "X")
  getDayName(date: Date): string {
    const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    return dayNames[date.getDay()];
  }

  // Genera las horas disponibles desde horadesde hasta horahasta
  generarHorasDisponibles(horaDesde: string, horaHasta: string): string[] {
    const hours: string[] = [];
    const x = parseInt(horaDesde, 10);
    const y = parseInt(horaHasta, 10);
    for (let i = x; i <= y; i++) {
      hours.push(i.toString() + ":00");
    }
    console.log(`horas: ${hours}`)
    return hours;
  }

  confirmarTurno(hour : any) {
    console.log("Incio funcion confirmar turno");
    this.selectedHour = hour;
    if (this.selectedDate && this.selectedHour) {
      console.log("Hora seleccionada:", hour)
      const isConfirmed = confirm(`¿Confirmás el turno para ${this.selectedDate} a las ${this.selectedHour}?`);
      if (isConfirmed) {
        this.confirmarYGuardarTurno();
      }
    }
  }

  confirmarYGuardarTurno() {
    // Lógica para guardar el turno con la fecha y hora seleccionadas
    console.log(`Turno confirmado para ${this.especialidadSeleccionada} el ${this.selectedDate} a las ${this.selectedHour}`);

    // Obtener datos del sessionStorage
    const myData: string | null = sessionStorage.getItem('user'); 
    if (myData) {
        try {
          const user = JSON.parse(myData);
          const pacienteId = user.id; 
          const medicoId = this.disponibilidad.id_medico;  
          // Preparar el objeto del turno
          const turno = {
            id_paciente: pacienteId, // ID del paciente
            id_medico: medicoId, 
            especialidad: this.especialidadSeleccionada,
            fecha: this.selectedDate,
            hora: this.selectedHour
          };
          console.log("Turno a guardar: ", turno);
          // Llamar a la API para guardar el turno
          this.consultaBackApi.guardarTurno(turno).subscribe((response) => {
            console.log("Turno guardado con éxito:", response);
            this.notifService.mostrarExito("Turno guardado con éxito."); 
            setTimeout(() => {
              this.especialidadesVisible = false; // Oculta el contenido
              this.mostrarMensajeExito = true; // Muestra el mensaje de éxito
            }, 1000); // Simulación de delay para el guardado

          }, (error) => {
              console.error("Error al guardar el turno:", error);
          });
        } catch (error) {
            console.error('Error al parsear el JSON:', error);
        }
        
    } else {
        console.log('No hay datos de usuario en el sessionStorage.');
    }
}

   // Método que se llama al hacer clic en un botón de hora
   selectHour(hour: string) {
    this.selectedHour = hour;
    console.log("Hora seleccionada:", this.selectedHour);
  }

  regresar() {
    this.mostrarMensajeExito = false; 
    this.especialidadesVisible = false; 
    this.clearVariablesPaciente();
  }

  clearVariablesPaciente(){
    this.selectedDate = null; 
    this.selectedHour = null;  
    this.especialidadSeleccionada = null;
    this.hoursTuno = []; 
    this.availableHours = []; 
    this.inputValue = ''; 
    this.especialidadesVisible = false;
  }

  //historial
  mostrarHistorialTurnos() {
    this.turnosPropios = false;
    this.mostrarHistorial = true;
    this.especialidadesVisible = false; 
    this.isLoading = true;
    const myData: string | null = sessionStorage.getItem('user'); 
    console.log(myData);

    if (myData) {
      try {
          
          const user = JSON.parse(myData);
          const pacienteId = user.id;

          this.consultaBackApi.getHistorialTurnos(pacienteId,1).subscribe((response) => {
            if (response.length == 0) {
              this.isHasHistory = false;
            } else {
              this.isHasHistory = true;
            }
            
            this.historialTurnos = response;
            this.isLoading = false;

            }, (error) => {
                console.error("Error al obtener el historial de turnos:", error);
                this.isHasHistory = false;
                this.isLoading = false;
            });

        } catch (error) {
          console.error('Error al parsear el JSON:', error);
          this.isLoading = false;
      }
    }
  
}

  mostrarMensajeCalificacion(turno: any) {
    this.turnoSeleccionado = turno; 
    this.calificacionSeleccionada = null; 
    this.mensajeCalificacionVisible = true;

    if(this.calificado) {
      turno.calificacion = "CALIFICADO"
    }
  }
  ocultarMensajeCalificacion() {
    this.mensajeCalificacionVisible = false; 
    this.turnoSeleccionado = null; 
    this.calificacionSeleccionada = null;
  }

  seleccionarCalificacion(calificacion: number) {
    this.calificacionSeleccionada = calificacion; 
    console.log("Calificación seleccionada:", this.calificacionSeleccionada);
}

  enviarCalificacion() {

    const calificacion = this.calificacionSeleccionada;
    const id = this.turnoSeleccionado.idTurno;
    console.log(" turno seleccionado  ", this.turnoSeleccionado);
    console.log(" calificacion seleccionado  ", this.calificacionSeleccionada);

    if(calificacion && id){

      const turnoSearch = {
        calificacion,
        id
      }
    
     this.consultaBackApi.sendCalification(turnoSearch).subscribe((response) => {
      console.log("calificacion guardada:", response);

    }, (error) => {
        console.error("Error al guardar calificacion:", error);
    }); 
  }
     this.mensajeGraciasVisible = true; // Mostrar el mensaje de agradecimiento

     // Opcional: Ocultar el mensaje de calificación después de enviar
     this.mensajeCalificacionVisible = false;
    
     // Puedes ocultar el mensaje de agradecimiento después de un tiempo
     setTimeout(() => {
         this.mensajeGraciasVisible = false; // Ocultar después de 3 segundos
     }, 3000);
  }

  misTurnos(){
    this.mostrarHistorial = false;
    this.especialidadesVisible = false; 
    this.turnosPropios = true;
    this.isLoadingAux = true;

    const myData: string | null = sessionStorage.getItem('user'); 
    console.log(myData);

    if (myData) {
      try {        
          const user = JSON.parse(myData);
          const pacienteId = user.id;

          this.consultaBackApi.getHistorialTurnos(pacienteId,2).subscribe((response) => {

            if (response.length == 0) {
              this.isHasTurno = false;
            } else {
              this.isHasTurno = true;
            }

            console.log("turnos lala : ",response)
            this.historialTurnos = response;
            this.isLoadingAux = false; 
              }, (error) => {
                  console.error("Error al obtener el historial de turnos:", error);
                  this.isLoadingAux = false;
                  this.isHasTurno = false;
            });

        } catch (error) {
          console.error('Error al parsear el JSON:', error);
          this.isLoadingAux = false;
      }
    }
  }
  generarGraficoCalificaciones() {
    console.log('Generar gráfico de calificaciones');
    this.router.navigate(['/calificaciones']);
}

ngAfterViewInit() {
  setTimeout(() => {
      const perfilElement = document.querySelector('.perfil');
      perfilElement?.classList.add('visible');
  }, 100); 
}

cancelarTurno(turno: any) {
  if (confirm('¿Seguro que querés cancelar este turno?')) {
    console.log("turno: ", turno)
    this.consultaBackApi.cancelarTurno(turno.idTurno).subscribe((response) => {

      turno.estado = 'Cancelado';
    }
    )
    turno.estado = 'Cancelado';
  }
}

esClickeable(turno: any): boolean {
  return turno.estado?.trim().toLowerCase() === 'finalizado'
      && turno.calificacion?.trim().toLowerCase() === 'pendiente';
}

}



