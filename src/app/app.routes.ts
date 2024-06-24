import { PRIMARY_OUTLET, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AdministradorComponent } from './componentes/administrador/administrador.component';
//import { error } from 'console';
import { ErrorComponent } from './componentes/error/error.component';
import { AfiliadoComponent } from './componentes/afiliado/afiliado.component';
import { MedicoComponent } from './componentes/medico/medico.component';

export const routes: Routes = [
    {path:'login', component:LoginComponent},
    {path:'afiliado',component:AfiliadoComponent},
    {path:'administrador',component:AdministradorComponent},
    {path:'registro', component:RegistroComponent},
    {path:'medico', component:MedicoComponent},
    {path:'',component:PrincipalComponent},
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