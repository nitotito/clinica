import { Pipe, PipeTransform } from '@angular/core';
import { Medico } from '../entidades/Medico';

@Pipe({
  name: 'medicos',
  standalone: true
})
export class MedicosPipe implements PipeTransform {

  transform(medicos: Medico[],filtro:String): any {
    return medicos.filter(medico =>
      medico.especialidad.toLowerCase().includes(filtro.toLowerCase())
    );
  }

}
