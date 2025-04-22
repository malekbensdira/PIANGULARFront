import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/immobiliers/list/list.component';
import { AddComponent } from './components/immobiliers/add/add.component';
import { EditComponent } from './components/immobiliers/edit/edit.component';
import { DetailComponent } from './components/immobiliers/detail/detail.component';
import { EstimateComponent } from './components/immobiliers/estimate/estimate.component';

const routes: Routes = [
  {
  path:'estimer',
component:EstimateComponent,
    data :{title: 'estimer'}
  },
  { 
    path: '', 
    component: ListComponent,
    data: { title: 'Liste des biens' } 
  },
  { 
    path: 'add', 
    component: AddComponent,
    data: { title: 'Ajouter un bien' } 
  },
  { 
    path: 'edit/:id', 
    component: EditComponent,
    data: { title: 'Modifier le bien' } 
  },
  { 
    path: 'detail/:id', 
    component: DetailComponent,
    data: { title: 'Détails du bien' } 
  },
  { path: 'estimate', component: EstimateComponent },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }