import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EspecialidadesComponent } from './pages/especialidades/especialidades.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'especialidades', 
    component: EspecialidadesComponent,
    children: [
      { path: ':id', component: ChatComponent }
    ]
  },
  { 
    path: 'consultas', 
    component: EspecialidadesComponent,
    children: [
      { path: ':id', component: ConsultaComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];