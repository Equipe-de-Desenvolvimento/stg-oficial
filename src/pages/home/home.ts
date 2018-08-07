import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {   
	  this.calendarOptions = {
      locale: 'pt-br',
      height: "auto",
      themeSystem: 'jquery-ui',
      buttonText: {
        today: 'Hoje'
      },
	    editable: true,
      eventLimit: true,
      header: {
        left: 'prev',
        center: 'title',
        right: 'today next'
      },
	    monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    	defaultDate: moment().format('YYYY-MM-DD')
	  };
  }

  clickButton(parametro){
    console.log(parametro);
  }

  updateEvent(parametro){
    console.log(parametro);
  }

  eventClick(parametro){
    console.log(parametro);
  }

}
