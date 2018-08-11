import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
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
  ]
})
export class HomePageModule {}
