import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExternoPrincipalPage } from './externo-principal';
// import { DatabaseProvider } from './../../providers/database/database';

@NgModule({
  declarations: [
    ExternoPrincipalPage,
  ],
  imports: [
    IonicPageModule.forChild(ExternoPrincipalPage),
  ],
})
export class ExternoPrincipalPageModule {}
