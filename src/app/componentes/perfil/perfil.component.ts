import { Component, OnInit } from '@angular/core';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { UserService } from '../../servicio/user.service'; 
import { Usuario } from '../../entidades/Usuario'
import { Medico } from '../../entidades/Medico';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario = { 
    id:null,
    tipoUsuario: "",
    email: "",
    dni: null,
    nombre: "",
    apellido: "",
    telefono: null,
    contra: "",
    especialidad: "",
    credencial: "",
    matricula: "",
    avatar: ""
  }

  medico: Medico = {
    id:null,
    email: "",
    dni: null,
    nombre: "",
    apellido: "",
    telefono: null,
    contra: "",
    especialidad: "",
    matricula: "",
    habilitacion: "",
    avatar: ""
  }

  idUser!: number;
  avatarBase64: string | null = null;
  tipoUsuario: string = "";
  dni_medic!: number;
  isProfileLoaded: boolean = false;


  constructor( private userService: UserService,  private consultasBackServiceService: ConsultasBackServiceService) {}

  ngOnInit(): void {
    const afiliadoData = sessionStorage.getItem('user');
    if (afiliadoData) {
      const user = JSON.parse(afiliadoData); 
      this.idUser = user.id;
      this.dni_medic = user.dni;
      this.tipoUsuario = user.tipoUsuario;

      switch(user.tipoUsuario){
        case "medico":
          this.loadMedicProfile();
          break;
        case "Paciente":
          this.loadUserProfile();
          break;
      }
    }
  }

 async loadUserProfile(){
    const currentUser = this.userService.getCurrentUser(this.idUser).subscribe(
      (userData: Usuario) => {
        this.usuario = userData; 
        console.log("this.usuario", this.usuario);
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    );
    this.isProfileLoaded = true;
    
  }

 async loadMedicProfile(): Promise<void>{
  this.isProfileLoaded = false;
   try{
      const userData: Medico[] = await firstValueFrom(this.consultasBackServiceService.getMedicoById(this.dni_medic));
      if (userData && userData.length > 0){
        this.medico = userData[0];
        console.log("medico obtenido: ", this.medico);
        this.usuario.nombre = this.medico.nombre;
        this.usuario.apellido = this.medico.apellido;
        this.usuario.email = this.medico.email;
        this.usuario.dni = this.medico.dni;
        this.usuario.telefono = this.medico.telefono;
        this.usuario.id =this.medico.id;
        this.usuario.avatar = this.medico.avatar;
        this.isProfileLoaded = true;
        } else {
    console.error('No se encontraron datos del médico.');
  } 
    } catch (error) {
      console.error('Error al obtener el médico:', error);
    } finally{
      this.isProfileLoaded = true;
    }
 
    console.log("valor de isprofileLoaded: ", this.isProfileLoaded);
  }

  onFileSelected(event: any) {
    // Obtengo el primer archivo
    const file: File = event.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Actualizo el avatar con la imagen seleccionada
        this.usuario.avatar = reader.result as string; 
      };
      // Leo el archivo como URL de datos
      reader.readAsDataURL(file); 
    }
  }

  updateProfile(): void {
    if (this.avatarBase64) {
      this.usuario.avatar = this.avatarBase64; 
    }
    //valido tipo de usario, realiza consulta de acuerdo al tipo.
    switch(this.tipoUsuario){
      case "medico":
        this.medico.nombre = this.usuario.nombre;
        this.medico.apellido = this.usuario.apellido;
        this.medico.email = this.usuario.email;
        this.medico.dni = this.usuario.dni;
        this.medico.telefono = this.usuario.telefono;
        this.medico.id = this.usuario.id;
        this.medico.avatar = this.usuario.avatar;
        this.userService.updateMedicProfile(this.medico).subscribe(response => {
          console.log('Perfil actualizado', response);
        }); 
        break;
      case "Paciente":
        this.userService.updateUserProfile(this.usuario).subscribe(response => {
          console.log('Perfil actualizado', response);
        }); 
        break;
    }
     
  }

  selectFile() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click(); 
  }

  editField(fieldName: string): void {
    const newValue = prompt(`Introduce un nuevo valor para ${fieldName}:`, (this.usuario as any)[fieldName]);
    if (newValue !== null) {
        // Actualizar el campo en el objeto usuario
        (this.usuario as any)[fieldName] = newValue;

    }
}

ngAfterViewInit() {
  setTimeout(() => {
      const perfilElement = document.querySelector('.perfil');
      perfilElement?.classList.add('visible');
  }, 100); 
}
}