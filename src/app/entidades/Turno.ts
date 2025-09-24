export interface Turno{
    id: number,
    id_paciente: number,
    id_medico: number,
    fecha:string,
    hora:string,
    especialidad:string,
    observaciones: string,
    estado: string,
    calificacion: string
}