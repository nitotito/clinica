import { CanActivateFn } from '@angular/router';
import { loginUser } from '../entidades/loginUser';

export const canActivateGuard: CanActivateFn = (route, state) => {
  var sesion:any;
  var sesionJ = sessionStorage.getItem('user');
  if(sesionJ != null){
    sesion = JSON.parse(sesionJ) as loginUser;
  }
  
  if(sesion.tipoUsuario == "administrativo"){
    
    return true;
  }

  return false; 
};
export const canActivateGuardAfiliado: CanActivateFn = (route, state) => {
  var sesion:any;
  var sesionJ = sessionStorage.getItem('user');
  if(sesionJ != null){
    sesion = JSON.parse(sesionJ) as loginUser;
  }
  
  if(sesion.tipoUsuario == "Paciente"){
    
    return true;
  }

  return false; 
};

export const canActivateGuardMedico: CanActivateFn = (route, state) => {
  var sesion:any;
  var sesionJ = sessionStorage.getItem('user');
  if(sesionJ != null){
    sesion = JSON.parse(sesionJ) as loginUser;
  }
  
  if(sesion.tipoUsuario == "medico"){
    
    return true;
  }

  return false; 
};