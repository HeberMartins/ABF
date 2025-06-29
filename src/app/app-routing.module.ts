import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContatoComponent } from './contato/contato.component';
import { NovocontatoComponent } from './novocontato/novocontato.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent },
  {path: 'contato/:id', component: ContatoComponent},
  {path: 'novocontato', component: NovocontatoComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
