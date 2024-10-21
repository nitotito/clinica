import { Component } from '@angular/core';
import { ngxCsv } from 'ngx-csv';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { Medico } from '../../entidades/Medico';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent {

  public datoUsuario: any = sessionStorage.getItem('user');
  public datoU: any;
  showDisponibilidadForm = false;
  showTurnosList = false;
  turnos: any[] = [];
  usuario: any;
  isModalOpen = false;
  opcionSeleccionada = '';
  turnoSeleccionado: any = null;

  // Objeto para almacenar la disponibilidad seleccionada
  disponibilidad = {
    desde: '',
    hasta: '',
    dias: [] as string[]  // Aquí se acumularán los días seleccionados
  };

  // Lista de días de la semana
  dias = [
    { nombre: 'Lunes', value: 'lu' },
    { nombre: 'Martes', value: 'ma' },
    { nombre: 'Miércoles', value: 'mi' },
    { nombre: 'Jueves', value: 'ju' },
    { nombre: 'Viernes', value: 'vi' }
  ];

  constructor(
    private consultaBackApi: ConsultasBackServiceService,
    private router: Router,
  ) {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      this.usuario = JSON.parse(userData);
    } else {
      console.error('No se encontraron datos de usuario en sessionStorage');
    }
  }

  // Método para obtener el dato del usuario
  public obtenerDato() {
    this.datoU = JSON.parse(this.datoUsuario);
    console.log("datos: " + this.datoU.nombre);
  }

  // Método para mostrar u ocultar el formulario de disponibilidad
  toggleDisponibilidadForm() {
    this.showDisponibilidadForm = !this.showDisponibilidadForm;
    if (this.showDisponibilidadForm) {
      this.showTurnosList = false; // Ocultar la lista de turnos si se muestra el formulario
    }
  }

  // Método para mostrar u ocultar la lista de turnos
  toggleTurnosList() {
    this.showTurnosList = !this.showTurnosList;
    if (this.showTurnosList) {
      this.showDisponibilidadForm = false; // Ocultar el formulario si se muestra la lista de turnos
      this.obtenerTurnos(); // Obtener turnos solo si se muestra la lista
    }
  }

  // Método para obtener los turnos del paciente
  obtenerTurnos() {
    this.consultaBackApi.getMedicoById(this.usuario.dni).subscribe(
      (medicos: Medico[]) => {
        this.consultaBackApi.getTurnosPaciente(medicos[0].id).subscribe(
          (response: any) => {
            this.turnos = response;
            console.log("this.turno :", this.turnos);
          },
          error => {
            console.error('Error al obtener los turnos:', error);
          }
        );
      });
  }

  // Método para alternar la selección de los días
  toggleDia(dia: string) {
    const index = this.disponibilidad.dias.indexOf(dia);
    if (index === -1) {
      this.disponibilidad.dias.push(dia); // Añadir el día si no está seleccionado
    } else {
      this.disponibilidad.dias.splice(index, 1); // Eliminar el día si ya está seleccionado
    }
  }

  // Método para enviar la disponibilidad del médico
  enviarDisponibilidad() {
    this.consultaBackApi.getMedicoById(this.usuario.dni).subscribe(
      (medicos: Medico[]) => {
        if (medicos && medicos.length > 0) {
          const disponibilidadCompleta = {
            ...this.disponibilidad,
            id_medico: medicos[0].id,
            especialidad: medicos[0].especialidad,
          };

          this.consultaBackApi.guardarDisponibilidad(disponibilidadCompleta).subscribe(
            response => {
              console.log('Disponibilidad guardada exitosamente:', response);
            },
            error => {
              console.error('Error al guardar disponibilidad:', error);
            }
          );
        } else {
          console.error('No se encontró información del médico');
        }
      },
      error => {
        console.error('Error al obtener el médico:', error);
      }
    );
  }

  // Método para generar y descargar el CSV
  generarCSV() {
    if (this.turnos.length > 0) {
      const csvData = this.turnos.map(turno => ({
        DNI: turno.DNI_paciente || '',
        Nombre: turno.Paciente || '',
        Fecha: turno.dia || '',
        Hora: turno.hora || '',
        Estado: turno.estado || ''
      }));

      const csvOptions = {
        filename: 'turnos',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Lista de Turnos para el Medico: ' + this.turnos[0].Medico,
        useBom: true,
        headers: ["DNI", "Nombre", "Fecha", "Hora", "Estado"]
      };

      new ngxCsv(csvData, csvOptions.filename, csvOptions);
    } else {
      console.error('No hay turnos disponibles para generar el CSV');
    }
  }
  openModal(turno: any) {
    this.turnoSeleccionado = turno;
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
    this.opcionSeleccionada = ''; // Limpiar la opción seleccionada
  }

  // Método para manejar el envío de las opciones
  enviarOpciones() {
    if (this.opcionSeleccionada) {
      console.log('Turno seleccionado:', this.turnoSeleccionado);
      console.log('Opción seleccionada:', this.opcionSeleccionada);

      this.consultaBackApi.updateTurno(this.turnoSeleccionado.id,this.opcionSeleccionada).subscribe();

      this.closeModal(); // Cerrar el modal después de enviar
    } else {
      console.error('Debe seleccionar una opción.');
    }
  }
}