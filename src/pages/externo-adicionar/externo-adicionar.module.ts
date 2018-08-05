import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExternoAdicionarPage } from './externo-adicionar';

@NgModule({
  declarations: [
    ExternoAdicionarPage,
  ],
  imports: [
    IonicPageModule.forChild(ExternoAdicionarPage),
  ],
})
export class ExternoAdicionarPageModule {}
