import { Component ,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, LinearScale, BarElement, Title, BarController, CategoryScale } from 'chart.js';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grafico-calificaciones',
  standalone: true,
  imports: [],
  templateUrl: './grafico-calificaciones.component.html',
  styleUrl: './grafico-calificaciones.component.scss'
})
export class GraficoCalificacionesComponent implements AfterViewInit {
  @ViewChild('graficoCanvas') graficoCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | undefined;
  
  calificaciones: any[] = [];
  idPaciente!: number;

  constructor(private consultasService: ConsultasBackServiceService, private router: Router,private http: HttpClient) {
    Chart.register(LinearScale, BarElement, BarController, CategoryScale, Title);
  }

  ngAfterViewInit(): void {
    this.crearGrafico();
  }



  crearGrafico() {
    const myData: string | null = sessionStorage.getItem('user');

    if (myData) {
      try {
        const user = JSON.parse(myData);
        const id = user.id;

        this.consultasService.getCalificacionesPorAfiliado(id).subscribe(
          (response) => {
            this.calificaciones = response;
            console.log("calificacion obtendia: ", this.calificaciones);
           const promedio = this.calculateAverageCalifications(this.calificaciones);          
            console.log("promedio: ", promedio);
            // Aquí puedes llamar a la función para generar el gráfico
            const promedios = promedio.map(data => data.promedio);
            const medicos = promedio.map(nombre => nombre.nombre);
            this.generarGrafico(promedios, medicos);
          },
          (error) => {
            console.error("Error al obtener las calificaciones:", error);
          }
        );
      } catch (error) {
        console.error('Error al parsear el JSON:', error);
      }
    }

  }

  calculateAverageCalifications(calificaciones: any[]): any[] {
    const medicos: { [id_Medico: string]: { nombreMedico: string; totalCalificacion: number; count: number } } = {}; // Tipo flexible

    // Sumar las calificaciones por médico
    calificaciones.forEach(turno => {
        const calificacion = Number(turno.calificacion);
        const nombreMedico = turno.nombre + ' ' +turno.apellido;
        const id_Medico = turno.id_medico;

        if (!medicos[id_Medico]) {
            medicos[id_Medico] = { nombreMedico: nombreMedico, totalCalificacion: 0, count: 0 };
        }

        medicos[id_Medico].totalCalificacion += calificacion;
        medicos[id_Medico].count++;
    });
    console.log("medicos", medicos);
    // Calcular el promedio
    const promedioCalificaciones = Object.keys(medicos).map(id_medico => {
        const id = Number(id_medico); // Convertir el id_medico de string a number

        return {
            nombre : medicos[id].nombreMedico,
            promedio: medicos[id].totalCalificacion / medicos[id].count
        };
    });
    console.log("lalalal", promedioCalificaciones);

    return promedioCalificaciones;
}

  generarGrafico(promedio:any[], medicos: any[]) {
    const ctx = this.graficoCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: medicos, // Cambia esto a tus etiquetas
          datasets: [{
            label: 'Calificaciones',
            data: promedio, // Cambia esto a tus datos
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      console.error('No se pudo obtener el contexto del canvas');
    }
  }

  volverAfilidado() {
    this.router.navigate(['/afiliado']); // Redirige a la página de afiliados
  }
}

