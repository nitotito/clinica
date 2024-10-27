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
    habilitacion:''
  }
  public medicos: Medico[] = [];

  constructor(public backservice:ConsultasBackServiceService){
  /*   backservice.getMedicos().subscribe(
      (consultaMedico:Medico[]) =>{
        this.medicos = consultaMedico;

      }
    );
 */
  };
  
  ngOnInit() {
    this.obtenerMedicos();
    this.obtenerDato();
  }

 public obtenerMedicos() {
    this.backservice.getMedicos().subscribe(
      (consultaMedico: Medico[]) => {
        this.medicos = consultaMedico;
      }
    );
  }

public obtenerDato() {
    this.datoU = JSON.parse(this.datoUsuario);
    console.log("datos : " + this.datoUsuario);
  }


/*    public obtenerDato(){
 
  this.datoU = JSON.parse(this.datoUsuario);
 console.log("datos : " + this.datoU.nombre);
 }   */


 
 accion(medico: any) {
  console.log("medico : " + JSON.stringify(this.medico));

this.backservice.updateMedico(medico).subscribe(
      updatedMedico => {
        console.log("Medico actualizado:", updatedMedico);
      },
      error => {
        console.error("Error actualizando médico:", error);
      }
    );
    (medico.habilitacion== "true") ? medico.habilitacion ="false" : medico.habilitacion ="true";

  medico.color = medico.color === 'red' ? 'green' : 'red';
  medico.glow = true;
  //setTimeout(() => medico.glow = false, 100000);
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

