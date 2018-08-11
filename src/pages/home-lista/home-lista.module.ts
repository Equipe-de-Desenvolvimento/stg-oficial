import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeListaPage } from './home-lista';

@NgModule({
  declarations: [
    HomeListaPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeListaPage),
  ],
})
export class HomeListaPageModule {}
