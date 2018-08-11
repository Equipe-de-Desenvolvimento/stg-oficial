import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import moment from 'moment';

import { WebserviceProvider } from "./../../providers/webservice/webservice";
import { DatabaseProvider } from './../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {
  calendarOptions: Options;
  showNavBar: boolean = true;

  parametros: any = {
    paciente: "",
    externos_selecionados_id: [], // Salva o externo_id dos itens selecionados
    url_externos_source: [] // Salva a URL para usar no events do fullcalendar
  };

  externoLista: any;

  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public webservice: WebserviceProvider, public database: DatabaseProvider) {
    
  }
  
  ngOnInit() {  
    // A função so irá inicializar o calendario quando o banco estiver pronto
    this.database.getDatabaseState().subscribe(rdy => {
      if(rdy){
        // Recebe os parametros passados caso tenha sido clicado no botao de pesquisar
        if (this.navParams.get('parametros') != null){
          this.parametros = this.navParams.get('parametros');
        }

        // Traz a lista de enderecos externos
        this.database.listaEnderecosExternos().then( (data) => {
          this.externoLista = data;

          if (this.navParams.get('parametros') == null){
            // Caso não tenha sido escolhido nenhum externo em especifico ele irá mostrar todos.  
            for (let x = 0; x < data.length; x++){
              let url = data[x].endereco+"app/listarhorarioscalendario?operador_id="+data[x].operador_id; 
              this.parametros.url_externos_source.push(url); 
              this.parametros.externos_selecionados_id.push(data[x].externo_id);
            }
          }
          this.configuraCalendario();
        }, (err) => false ).catch(() => false); 
        
      }
    });
  }

  configuraCalendario(){

    console.log(this.parametros.url_externos_source);

    this.calendarOptions = {
      locale: 'pt-br',
      height: "auto",
      themeSystem: 'jquery-ui',
      eventLimit: 2,
      eventLimitText: "mais",
      buttonText: {
        today: 'Hoje'
      },
	    editable: true,
      header: {
        left: 'prev',
        center: 'title',
        right: 'today next'
      },
	    monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      defaultDate: moment().format('YYYY-MM-DD'),
      eventSources: this.parametros.url_externos_source
    };
    
  }

  showHideBarraPesquisa(){
    this.showNavBar = !this.showNavBar;
  }

  pesquisar(){
    for (let i = 0; i < this.parametros.url_externos_source.length; i++){
      this.parametros.url_externos_source[i] = this.parametros.url_externos_source[i] + "&paciente="+this.parametros.paciente;
    }
    
    this.showNavBar = !this.showNavBar;
    
    // Renderiza a pagina novamente para atualizar o atributo event do full calendar
    this.navCtrl.setRoot(this.navCtrl.getActive().component, { parametros: this.parametros });
  }

  selectEmpresa() {
    
    // Testa se a variavel é um array antee para previnir erros de execução
    if (Array.isArray(this.externoLista)) {
      let inputs = [];

      // Criando a estrutura dos inputs
      for (let i = 0; i < this.externoLista.length; i++) {
        
        inputs.push({
          type: "checkbox",
          label: this.externoLista[i].nome,
          value:  JSON.stringify(this.externoLista[i]) // O campo value so aceita strings
        });
      }

      // Criando o alerta
      let alerta = this.alertCtrl.create({
        title: "Selecione os externos que deseja buscar",
        inputs: inputs,
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Ok',
            handler: (data) => {
              
              this.parametros.url_externos_source = []; // "Zera" a seleção anterior
              this.parametros.externos_selecionados_id = []; // "Zera" a seleção anterior
              // O valor de "data" é um array de strings com os values selecionados
              if(data.length > 0){
                for(let i = 0; i < data.length; i++){
                  let json = JSON.parse(data[i]); //Transforma a string em JSON novamente
                  let url = json.endereco+"app/listarhorarioscalendario?operador_id="+json.operador_id;
                  
                  this.parametros.url_externos_source.push(url); 
                  this.parametros.externos_selecionados_id.push(json.externo_id);
                }
              }
            }
          }
        ]
      });

      alerta.present();
    }
  }

  clickButton(parametro){
  }

  eventClick(parametro){
    let dadosPesquisa = {
      paciente: this.parametros.paciente, // Paciente que foi pesquisado
      externoLista: JSON.stringify(this.externoLista),
      externos_selecionados_id: this.parametros.externos_selecionados_id, // Quais os externos selecionados
      data: parametro.event.start.format("YYYY-MM-DD"),
      situacao: ""
    }
    this.navCtrl.push("HomeListaPage", {parametros: dadosPesquisa});
  }

  dayClick(parametro){
    
    let dadosPesquisa = {
      paciente: this.parametros.paciente, // Paciente que foi pesquisado
      externoLista: JSON.stringify(this.externoLista),
      externos_selecionados_id: this.parametros.externos_selecionados_id, // Quais os externos selecionados
      data: parametro.date.format("YYYY-MM-DD"),
      situacao: ""
    }
    this.navCtrl.push("HomeListaPage", {parametros: dadosPesquisa});
  }

}
