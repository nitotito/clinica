import { PRIMARY_OUTLET, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { RegistroComponent } from './componentes/registro/registro.component';
//import { error } from 'console';
import { ErrorComponent } from './componentes/error/error.component';
import { AfiliadoComponent } from './componentes/afiliado/afiliado.component';

export const routes: Routes = [
    {path:'login', component:LoginComponent},
    {path:'afiliado',component:AfiliadoComponent},

    {path:'registro', component:RegistroComponent},

    {path:'',component:PrincipalComponent},

    {path:'**',component:ErrorComponent}
];  
