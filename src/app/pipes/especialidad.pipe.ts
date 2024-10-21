import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarEspecialidad',
  standalone: true
})
export class EspecialidadPipe implements PipeTransform {

  transform(especialidades: string[], filtro: string): string[] {
    if (!especialidades || !filtro) {
      return especialidades;
    }

    // Filtrar las especialidades que contengan la palabra clave del filtro
    return especialidades.filter(especialidad => 
      especialidad.toLowerCase().includes(filtro.toLowerCase())
    );
  }
}