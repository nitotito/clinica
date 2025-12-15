import { Component, AfterViewInit } from '@angular/core';
import { ngxCsv } from 'ngx-csv';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { Medico } from '../../entidades/Medico';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class MedicoComponent implements AfterViewInit {

  public datoUsuario: any = sessionStorage.getItem('user');
  public datoU: any;
  showDisponibilidadForm = false;
  showTurnosList = false;
  turno: any;
  turnos: any[] = [];
  usuario: any;
  isModalOpen = false;
  opcionSeleccionada = '';
  turnoSeleccionado: any = null;
  isLoading: boolean = false;
  mostrarHistorial: boolean = false;
  historialTurnos: any[] = []; 
  mostrarTurnosPaciente: boolean = false;
  mostrarModal: boolean = false;
  observaciones: string = '';
  nombreMedico: string | null = '';

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

  ngOnInit() {
    const medicoData = sessionStorage.getItem('user');
    if (medicoData) {
      const medicoObj = JSON.parse(medicoData); // Parsear el JSON
      this.nombreMedico = medicoObj.nombre || 'Afiliado'; // Asignar el nombre o usar 'Afiliado' como fallback
    }
  }

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
      // Ocultar la lista de turnos si se muestra el formulario
      this.showTurnosList = false; 
      this.mostrarHistorial = false;
    }
  }

  // Método para mostrar u ocultar la lista de turnos
  toggleTurnosList() {
    this.mostrarHistorial = false;
    this.showTurnosList = !this.showTurnosList;
    if (this.showTurnosList) {
      this.showDisponibilidadForm = false;
      this.isLoading = true;
      this.obtenerTurnos(); 
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
            this.isLoading = false; 
          },
          error => {
            console.error('Error al obtener los turnos:', error);
            this.isLoading = false; 
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
        DNI: turno.dniPaciente || '',
        Nombre: turno.paciente || '',
        Fecha: turno.fecha || '',
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
        title: 'Lista de Turnos para el Medico: ' + this.turnos[0].medico,
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

    this.consultaBackApi.updateTurno(this.turnoSeleccionado.id, this.opcionSeleccionada).subscribe({
      next: () => {
        // ✅ volver a cargar los turnos
        this.obtenerTurnos();
        this.closeModal();
      },
      error: err => console.error('Error en update:', err)
    });

  } else {
    console.error('Debe seleccionar una opción.');
  }
}

  mostrarHistorialTurnosMed() {
    this.mostrarHistorial = true; 
    this.showDisponibilidadForm = false;
    this.showTurnosList = false;
    const userData = sessionStorage.getItem('user');

    if (userData) {
        const usuario = JSON.parse(userData);
        const medicoId = usuario.id; 
        console.log("medicoid :", medicoId);
        // Llama al servicio para obtener el historial de turnos del médico
        this.consultaBackApi.getHistorialTurnosMed(medicoId).subscribe(
            (response) => {
                this.historialTurnos = response; // Guarda el historial obtenido
                console.log("hitorial turnos : ",this.historialTurnos);
            },
            (error) => {
                console.error('Error al obtener el historial de turnos:', error);
            }
        );
    }
}

mostrarObservaciones(turno: any) {
  this.turno = turno;
    this.mostrarModal = true;
  console.log('Observaciones para el turno:', turno);
  
}

cerrarModal() {
  this.mostrarModal = false;
  this.observaciones = ''; // Limpiar el textarea al cerrar
}

guardarObservaciones(turno: any) {
  turno.observaciones = this.observaciones;
  console.log('Guardando observaciones:', this.observaciones, 'para el turno:', turno);
  this.consultaBackApi.updateObservaciones(turno.idTurno, turno).subscribe(
    (response) => {

        console.log("Actualizado : ",response);
    },
    (error) => {
        console.error('Error al obtener el historial de turnos:', error);
    }
);
  // Aquí puedes hacer la llamada a tu API para guardar las observaciones
  this.cerrarModal();
}

  ngAfterViewInit() {
    setTimeout(() => {
        const perfilElement = document.querySelector('.perfil');
        perfilElement?.classList.add('visible');
    }, 100); // Espera 100ms para asegurar que el elemento esté en el DOM
  }
  
}