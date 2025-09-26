import { Component } from '@angular/core';
import { MedicosPipe } from '../../pipes/medicos.pipe'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { Medico } from '../../entidades/Medico';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [MedicosPipe,CommonModule,FormsModule],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})


export class AdministradorComponent {
  public filtro:String ="";
  public datoUsuario:any = sessionStorage.getItem('user');
  public datoU:any;
  showDisponibilidadForm = false;
  showTurnosList = false;
  turno: any;
  usuario: any;
  isModalOpen = false;
  dniMedico: number | null = null;
  showHabilitar = false;
  activeSection: string | null = null;

  medico: Medico= {
    id:null,
    email:'', 
    dni:null, 
    nombre:'',
    apellido:'',
    telefono:null,
    contra:'',
    especialidad:'',
    matricula:'',
    habilitacion:'',
    avatar: ''
  }

  disponibilidad = {
    desde: '',
    hasta: '',
    dias: [] as string[]  // Aquí se acumularán los días seleccionados
  };

   dias = [
    { nombre: 'Lunes', value: 'lu' },
    { nombre: 'Martes', value: 'ma' },
    { nombre: 'Miércoles', value: 'mi' },
    { nombre: 'Jueves', value: 'ju' },
    { nombre: 'Viernes', value: 'vi' }
  ];

  public medicos: Medico[] = [];
  medicoSeleccionado: any = null;

  constructor(public backservice:ConsultasBackServiceService){};

  setActive(section: string) {
    if (section === 'disponibilidad') {
      // en vez de activar directo, abrimos el modal
      this.openModal();
    } else {
      this.activeSection = section;
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.dniMedico = 0;
  }
  
  ngOnInit() {
    this.obtenerMedicos();
    this.obtenerDato();
  }

  toggleHabilitacion() {
    this.showHabilitar = !this.showHabilitar;
    if (this.showHabilitar && this.medicos.length === 0) {
      this.obtenerMedicos(); 
    }
  }

 public obtenerMedicos() {
    this.backservice.getMedicos().subscribe(
      (consultaMedico: Medico[]) => {
        this.medicos = consultaMedico;
        console.log("medicos: ",consultaMedico)
      }
    );
  }

  public  buscarMedico() {
    if (!this.dniMedico) {
      alert('Debe ingresar un DNI');
      return;
    }

    this.backservice.getMedicoById(this.dniMedico).subscribe({
      next: (medico) => {
        if (medico) {
          this.medicoSeleccionado = medico[0];
          console.log("medico selecciona; ", this.medicoSeleccionado)
          this.closeModal();
          this.activeSection = 'disponibilidad';
           this.backservice.getDisponibilidadByMedicoId(medico[0].id).subscribe({
          next: (dispo) => {
            if (dispo) {
              this.disponibilidad = {
                ...dispo,
                dias: dispo.dias ? dispo.dias.split(",") : []
              };
            }
          },
          error: () => {
            console.log("El médico no tiene disponibilidad registrada");
            this.disponibilidad = { desde: '', hasta: '', dias: [] }; // limpio
          }
        });
        } else {
          alert('Médico no encontrado');
        }
      },
      error: () => {
        alert('Médico no encontrado');
      }
    });
  }

public obtenerDato() {
    this.datoU = JSON.parse(this.datoUsuario);
    console.log("datos : " + this.datoUsuario);
  }

toggleDisponibilidadForm() {
    this.showDisponibilidadForm = !this.showDisponibilidadForm;
    if (this.showDisponibilidadForm) {
      // Ocultar la lista de turnos si se muestra el formulario
      this.showTurnosList = false; 
    }
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
 
    accion(medico: any) {
      console.log("Antes:", medico.habilitacion);

      medico.habilitacion = !medico.habilitacion;

      this.backservice.updateMedico(medico).subscribe(
        updatedMedico => {
          console.log("Medico actualizado:", updatedMedico);
        },
        error => {
          console.error("Error actualizando médico:", error);
        }
      );

      medico.color = medico.color === 'red' ? 'green' : 'red';
      medico.glow = true;
    }
 enviarDisponibilidad() {
    this.backservice.getMedicoById(this.usuario.dni).subscribe(
      (medicos: Medico[]) => {
        if (medicos && medicos.length > 0) {
          const disponibilidadCompleta = {
            ...this.disponibilidad,
            id_medico: medicos[0].id,
            especialidad: medicos[0].especialidad,
          };

          this.backservice.guardarDisponibilidad(disponibilidadCompleta).subscribe(
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

generarPDF() {  
  const data = document.getElementById('medicosTable'); // Obtener el elemento de la tabla
  //const logoUrl = 'essets/logo.jpg'; // Ruta del logo
  console.log("paso 1");
  // Cargar la imagen del logo antes de generar el PDF
  const img = new Image();
  
 console.log("kjsdkflalkjshdf",data);
  //img.src = logoUrl;

  console.log("paso 2");
  //img.onload = () => {
    //console.log("paso 2.2");
    html2canvas(data!).then(canvas => {
      console.log("paso 3");
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      const imgWidth = 190; // Ancho del PDF
      const pageHeight = pdf.internal.pageSize.height; // Altura de la página
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Ajustar altura de imagen
      let heightLeft = imgHeight;

      let position = 0;
      console.log("paso 4");
      // Agregar el logo en la parte superior del PDF (x: 10, y: 10, tamaño ajustado)
      //pdf.addImage(img, 'PNG', 10, 10, 30, 30); // Cambia el tamaño y posición según tus necesidades

      // Espacio entre el logo y la tabla
      position = 40; // Espacio desde la parte superior después del logo
      console.log("paso 5");
      // Agregar la tabla al PDF después del logo
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Agregar más páginas si la tabla es más larga que una página
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      console.log("PDF generado con logo");
      pdf.save('medicos.pdf'); // Guardar el PDF con el logo
    });

  }
}

