import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { DatabaseProvider } from './../../providers/database/database';
import { FullCalendarModule } from 'ng-fullcalendar';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    FullCalendarModule,
    IonicPageModule.forChild(HomePage),
  ],
  providers: [
    DatabaseProvider
  ]
})
export class HomePageModule {}
