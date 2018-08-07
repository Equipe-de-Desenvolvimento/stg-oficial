import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { DatabaseProvider } from './../../providers/database/database';
<<<<<<< HEAD
import { FullCalendarModule } from 'ng-fullcalendar';
=======
>>>>>>> 42affb6314182fc8c7c676239e4b25798a6e5091

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
<<<<<<< HEAD
    FullCalendarModule,
=======
>>>>>>> 42affb6314182fc8c7c676239e4b25798a6e5091
    IonicPageModule.forChild(HomePage),
  ],
  providers: [
    DatabaseProvider
  ]
})
export class HomePageModule {}
