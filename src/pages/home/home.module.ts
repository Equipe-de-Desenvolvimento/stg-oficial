import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { DatabaseProvider } from './../../providers/database/database';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  providers: [
    DatabaseProvider
  ]
})
export class HomePageModule {}
