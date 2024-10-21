import { PRIMARY_OUTLET, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AdministradorComponent } from './componentes/administrador/administrador.component';
//import { error } from 'console';
import { ErrorComponent } from './componentes/error/error.component';
import { AfiliadoComponent } from './componentes/afiliado/afiliado.component';
import { MedicoComponent } from './componentes/medico/medico.component';
import { canActivateGuard, canActivateGuardAfiliado ,canActivateGuardMedico } from './guard/can-activate.guard';
import { GraficoCalificacionesComponent } from './componentes/grafico-calificaciones/grafico-calificaciones.component';

export const routes: Routes = [
    {path:'login', component:LoginComponent},
    {path:'afiliado',component:AfiliadoComponent, canActivate:[canActivateGuardAfiliado]},
    {path:'admin',component:AdministradorComponent, canActivate:[canActivateGuard]},
    {path:'registro', component:RegistroComponent},
    {path:'medico', component:MedicoComponent, canActivate:[canActivateGuardMedico]},
    {path:'',component:PrincipalComponent},
    {path:'calificaciones', component: GraficoCalificacionesComponent },
    {path:'**',component:ErrorComponent}
];  
/* export const routes: Routes = [
    {
        path: 'principal', component: PrincipalComponent,
        children:[
            {path:'login', component:LoginComponent, canDeactivate: [usuariodeslogueadoGuard]},
            {path:'registro', component:RegistroComponent, canActivate: [usuariologueadoGuard,usuariodeslogueadoGuard]},
            {path:'bienvenida', component:PrincipalComponent},
            {path:'**', component:LoginComponent}
        ]
    },
    { path: '', redirectTo: 'principal' , pathMatch: 'full' },
    { path: '**', component: ErrorComponent }
]; */