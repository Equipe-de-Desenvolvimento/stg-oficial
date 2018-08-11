import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeListaDetalhesPage } from './home-lista-detalhes';

@NgModule({
  declarations: [
    HomeListaDetalhesPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeListaDetalhesPage),
  ],
})
export class HomeListaDetalhesPageModule {}
