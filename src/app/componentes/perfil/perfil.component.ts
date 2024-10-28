import { Component, OnInit } from '@angular/core';
import { ConsultasBackServiceService } from '../../servicio/consultas-back-service.service';
import { UserService } from '../../servicio/user.service'; 
import { Usuario } from '../../entidades/Usuario'
import { Medico } from '../../entidades/Medico';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
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

  constructor( private userService: UserService,  private consultasBackServiceService: ConsultasBackServiceService) {}

  ngOnInit(): void {
    const afiliadoData = sessionStorage.getItem('user');
    if (afiliadoData) {
      const user = JSON.parse(afiliadoData); // Asegúrate de que `user` tiene la estructura correcta
      this.idUser = user.id;
      this.dni_medic = user.dni;
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

  loadUserProfile(): void {
    const currentUser = this.userService.getCurrentUser(this.idUser).subscribe(
      (userData: Usuario) => {
        this.usuario = userData; 
        console.log("this.usuario", this.usuario);
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }

  loadMedicProfile(){
    const currentUser = this.consultasBackServiceService.getMedicoById(this.dni_medic).subscribe(
      (userData: Medico[]) => {
        this.medico = userData[0];
        this.usuario.nombre = this.medico.nombre;
        this.usuario.apellido = this.medico.apellido;
        this.usuario.email = this.medico.email;
        this.usuario.dni = this.medico.dni;
        this.usuario.telefono = this.medico.telefono;
        this.usuario.id =this.medico.id;

      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Obtiene el primer archivo
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.usuario.avatar = reader.result as string; // Actualiza el avatar con la imagen seleccionada
      };
      reader.readAsDataURL(file); // Lee el archivo como URL de datos
    }
  }

  updateProfile(): void {
    if (this.avatarBase64) {
      this.usuario.avatar = this.avatarBase64; 
    }
    console.log("this usuario actualizar : ", this.usuario)
     this.userService.updateUserProfile(this.usuario).subscribe(response => {
      console.log('Perfil actualizado', response);
    }); 
  }

  selectFile() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click(); // Simula el clic en el input de archivo
  }

  editField(fieldName: string): void {
    const newValue = prompt(`Introduce un nuevo valor para ${fieldName}:`, (this.usuario as any)[fieldName]);
    if (newValue !== null) {
        // Actualizar el campo en el objeto usuario
        (this.usuario as any)[fieldName] = newValue;

        // También podrías llamar a un método para guardar los cambios en la base de datos
        // this.userService.updateUserProfile(this.usuario).subscribe(...);
    }
}

ngAfterViewInit() {
  setTimeout(() => {
      const perfilElement = document.querySelector('.perfil');
      perfilElement?.classList.add('visible');
  }, 100); // Espera 100ms para asegurar que el elemento esté en el DOM
}
}