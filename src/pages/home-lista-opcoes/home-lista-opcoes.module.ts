import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeListaOpcoesPage } from './home-lista-opcoes';

@NgModule({
  declarations: [
    HomeListaOpcoesPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeListaOpcoesPage),
  ],
})
export class HomeListaOpcoesPageModule {}
