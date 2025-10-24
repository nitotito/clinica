import { Component } from '@angular/core';
import { MedicosPipe } from '../../pipes/medicos.pipe'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { Medico } from '../../entidades/Medico';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { NotificacionService } from '../../servicio/notificacion.service';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [MedicosPipe,CommonModule,FormsModule],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css',
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
  modalActivo: string | null = null;
  resultadoInforme: any = null;
  filtros: any = {};
  turnos: any[] = [];
  fechaActual: Date = new Date();

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

    nuevoUsuario: any = {
      tipoUsuario: '',
      nombre: '',
      apellido: '',
      email: '',
      dni: '',
      telefono: '',
      matricula: '',
      especialidad: '',
      contrasenia: ''
  };

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

  abrirModal(tipo: string) {
    this.modalActivo = tipo;
    this.filtros = {}; // limpia datos previos
  }

  cerrarModal() {
    this.modalActivo = null;
  }

  public medicos: Medico[] = [];
  medicoSeleccionado: any = null;

  constructor(public backservice:ConsultasBackServiceService,private notifService: NotificacionService){};

      setActive(section: string) {
      this.activeSection = section;

      if (section === 'disponibilidad') {
        this.medicoSeleccionado = null;
        this.obtenerMedicos();
      }
    }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.dniMedico = null;
  }
  
  ngOnInit() {
    console.log("🟢 AdministradorComponent inicializado");
    this.obtenerMedicos();
    this.obtenerDato();
    this.obtenerTurnosDelDia();
  }

  toggleHabilitacion() {
    this.showHabilitar = !this.showHabilitar;
    if (this.showHabilitar && this.medicos.length === 0) {
      this.obtenerMedicos(); 
    }
  }

  obtenerTurnosDelDia() {
    const fecha = this.fechaActual.toISOString().split('T')[0]; // yyyy-mm-dd
    console.log("📅 Consultando turnos del día:", fecha);

    this.backservice.getTurnosPorFecha(fecha).subscribe({
      next: (data: any[]) => {
        this.turnos = data || [];
        console.log("✅ Turnos del día:", this.turnos);
      },
      error: (err: any) => {
        console.error("❌ Error al obtener turnos:", err);
        this.turnos = [];
        this.notifService.mostrarError('Error al cargar los turnos del día.');
      }
    });
  }

 public obtenerMedicos() {
    this.backservice.getMedicos().subscribe(
      (consultaMedico: Medico[]) => {
        this.medicos = consultaMedico;
        console.log("medicos: ",consultaMedico)
      }
    );
  }

  public buscarMedico() {
    if (!this.dniMedico) {
      alert('Debe ingresar un DNI');
      return;
    }

    this.backservice.getMedicoById(this.dniMedico).subscribe({
      next: (medico) => {
        if (medico) {
          this.medico = medico[0];
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
              this.notifService.mostrarError('El médico no tiene disponibilidad registrada.');
              console.log("El médico no tiene disponibilidad registrada");
              this.disponibilidad = { desde: '', hasta: '', dias: [] }; // limpio
            }
          });
        } else {
          this.notifService.mostrarError('Medico no encontrado.');
          console.log('Médico no encontrado');
        }
      },
      error: () => {
        this.notifService.mostrarError('Medico no encontrado.');
        console.log('Médico no encontrado');
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

public enviarDisponibilidad() {
    console.log("this.dispo: ", this.disponibilidad);
    this.backservice.guardarDisponibilidad(this.disponibilidad).subscribe({
    next: (res) => {
          if (res.status === 201) {
            console.log('✅ Disponibilidad guardada correctamente');
            this.notifService.mostrarExito('Disponibilidad guardada correctamente.');
          }
        },
        error: (err) => {
          this.notifService.mostrarError('Error al guardar disponibilidad.');
          console.error('❌ Error al guardar', err);
        }
      });

  }

public generarPDF() {  
  const data = document.getElementById('medicosTable'); // Obtener el elemento de la tabla
  //const logoUrl = 'essets/logo.jpg'; // Ruta del logo
  console.log("paso 1: ", data);
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

  esMedicoOTecnico(): boolean {
    return this.nuevoUsuario.tipoUsuario === 'medico' || this.nuevoUsuario.tipoUsuario === 'tecnico';
  }

  guardarUsuario() {
    if (!this.nuevoUsuario.tipoUsuario || !this.nuevoUsuario.nombre || !this.nuevoUsuario.dni) {
      this.notifService.mostrarError('Por favor complete los campos obligatorios.');
      return;
    }
    console.log("tipo usuario a guardar: ", this.nuevoUsuario.tipoUsuario);
    switch(this.nuevoUsuario.tipoUsuario){
      case "administrativo":
          this.backservice.registrarAdmin(this.nuevoUsuario).subscribe({
            next: (res) => {
              console.log('🧾 Usuario guardado:', res);
            },
            error: (err)=>{
              console.log("error al guardar : ", err);
            }

          })
        break;

      case "tecnico":
      case "medico":  
          this.backservice.registrarMed(this.nuevoUsuario).subscribe({
            next: (res) => {
              console.log('🧾 Usuario guardado:', res);
            },
            error: (err)=>{
              console.log("error al guardar : ", err);
            }

          })
        break;
    }
    this.notifService.mostrarExito('Usuario guardado correctamente.');
    this.nuevoUsuario = { tipoUsuario: '', nombre: '', apellido: '', email: '', dni: '', telefono: '', matricula: '', especialidad: '' };
  }

  generarInforme(tipo: string) {
  console.log(`Generando informe: ${tipo}`, this.filtros);

  switch (tipo) {
    case 'turnosPorFecha':
      const { fechaDesde, fechaHasta } = this.filtros;

      if (!fechaDesde || !fechaHasta) {
        this.notifService.mostrarError('Debe seleccionar fechas de inicio y fin');
        return;
      }

      // 🧩 Llamamos al back que devuelve el PDF
      this.backservice.getReporteMedico(fechaDesde, fechaHasta).subscribe({
        next: (pdfBlob: Blob) => {
          const blob = new Blob([pdfBlob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          // Abrir en nueva pestaña
          window.open(url);

          // O descargar directamente:
          // const a = document.createElement('a');
          // a.href = url;
          // a.download = 'reporte_medicos.pdf';
          // a.click();

          console.log('✅ Reporte PDF generado correctamente');
          this.notifService.mostrarExito('Reporte generado con éxito.');
        },
        error: (err) => {
          console.error('❌ Error generando reporte:', err);
          this.notifService.mostrarError('Error al generar el reporte.');
        }
      });
      break;

    case 'medicosPorEspecialidad':
      console.log('👉 A implementar lógica para médicos por especialidad');
      break;

    case 'medicosPorDia':
      console.log('👉 A implementar lógica para médicos por día');
      break;
  }

  this.cerrarModal();
}

seleccionarMedico(medico: any) {
  this.medicoSeleccionado = medico;
  console.log("👨‍⚕️ Médico seleccionado:", medico);

  this.backservice.getDisponibilidadByMedicoId(medico.id).subscribe({
    next: (dispo) => {
      if (dispo) {
        this.disponibilidad = {
          ...dispo,
          dias: dispo.dias ? dispo.dias.split(",") : []
        };
      } else {
        this.disponibilidad = { desde: '', hasta: '', dias: [] };
        this.notifService.mostrarError('El médico no tiene disponibilidad registrada.');
      }
    },
    error: () => {
      this.disponibilidad = { desde: '', hasta: '', dias: [] };
      this.notifService.mostrarError('Error al obtener disponibilidad.');
    }
  });
}

cancelarSeleccionMedico() {
  this.medicoSeleccionado = null;
}
}

