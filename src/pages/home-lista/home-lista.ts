import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController, LoadingController, AlertController } from 'ionic-angular';

import { WebserviceProvider } from '../../providers/webservice/webservice';

@IonicPage()
@Component({
  selector: 'page-home-lista',
  templateUrl: 'home-lista.html',
})
export class HomeListaPage {
  parametros: any;
  inf_pesq: Array<any> = []; // Salva as informações que serão usadas na req. GET

  agenda: any = []; // Salva os registros que irão vir das req.
  agendaFiltrada: any = []; // Salva os registros após filtrar pelo nome.
  resumo: any; // Salva a qtde de resultados das req.

  constructor(public navCtrl: NavController, public modalPage: ModalController, public alertCtrl: AlertController, public webservice: WebserviceProvider, public loadingCtrl: LoadingController, public navParams: NavParams, public popoverCtrl: PopoverController) {
    this.parametros = this.navParams.get('parametros');
    this.inf_pesq = [];

    let extList = [];
    extList = JSON.parse(this.parametros.externoLista);
    
    for (let i = 0; i < extList.length; i++){
      if (this.parametros.externos_selecionados_id.indexOf(extList[i].externo_id) != -1) {
        this.inf_pesq.push({
          externoNome: extList[i].nome,
          endereco: extList[i].endereco,
          operador_id: extList[i].operador_id,
          paciente: this.parametros.paciente,
          situacao: "",
          data: this.parametros.data
        });
      }
    }

    // Faz a pesquisa nas urls
    if (this.inf_pesq.length > 0) this.pesquisarLista();
  }

  mostrarOpcoesAvancadas(event){
    let popover = this.popoverCtrl.create('HomeListaOpcoesPage',{parametros: this.parametros});
    popover.onDidDismiss((dados) => { // Será executado quando for clicado no botão "pesquisar"
      this.inf_pesq = [];
      
      if(dados != null){
        // Filtro da situação 
        this.parametros.situacao = dados.situacao;

        // Adiciona a url dos enderecos externos selecionados
        for (let i = 0; i < dados.ext_selecionados.length; i++){
          this.inf_pesq.push({
            externoNome: dados.ext_selecionados[i].nome,
            endereco: dados.ext_selecionados[i].endereco,
            operador_id: dados.ext_selecionados[i].operador_id,
            paciente: this.parametros.paciente,
            situacao: dados.situacao,
            data: this.parametros.data
          });
        }

        // Faz a pesquisa nas urls
        if (this.inf_pesq.length > 0) this.pesquisarLista();

      }
    });
    popover.present({ev: event});
  }

  pesquisarLista(){
    // Fazendo a animação de carregando
		let loadingEffect = this.loadingCtrl.create({
			content: 'Aguarde um momento...'
    });
    loadingEffect.present();

    this.agenda = []; // Apaga os reistros que estão sendo mostrados no momento
    this.agendaFiltrada = []; // Apaga os reistros que estão sendo mostrados no momento
    this.resumo = {
      livre: 0,
      bloqueado: 0,
      ocupado: 0,
      faltou: 0,
      total: 0
    };

    for (let i = 0; i < this.inf_pesq.length; i++){
      this.webservice.buscaAgendaLista(this.inf_pesq[i]).subscribe(
        (resultado) => {
          /* Tirando o efeito de loading */
          loadingEffect.dismiss();

          if(Array.isArray(resultado.agenda)){

            // Insere os registros na variavel agenda
            for (let x = 0; x < resultado.agenda.length; x++) {
              let tempObj = resultado.agenda[x];

              this.agenda.push(tempObj);
              this.agendaFiltrada.push(tempObj);
            }

            // Atualiza a variavel resumo
            this.resumo.livre += parseInt(resultado.resumo.LIVRE);
            this.resumo.bloqueado += parseInt(resultado.resumo.BLOQUEADO);
            this.resumo.ocupado += parseInt(resultado.resumo.OK);
            this.resumo.faltou += parseInt(resultado.resumo.FALTOU);
            this.resumo.total += parseInt(resultado.resumo.TOTAL);
          }
          else {
            this.agenda = [];
            this.agendaFiltrada = [];
            this.resumo.livre = 0;
            this.resumo.bloqueado = 0;
            this.resumo.ocupado = 0;
            this.resumo.faltou = 0;
            this.resumo.total = 0;
          }
        },
        (erro) => {
          /* Tirando o efeito de loading */
          loadingEffect.dismiss();
          // Mostrando o alerta em caso de erro
          this.mostraAlerta('Erro!', "Erro de conexão. Verifique o link do externo.");
        }
      );
    }
  }

  // Configurando a mensagem de alerta
  mostraAlerta(titulo, mensagem){
    let alerta = this.alertCtrl.create({
      title: titulo,
      subTitle: mensagem,
      buttons: ['OK']
    });
    alerta.present();
  }

  filtraResutados(ev: any){
    let val = ev.target.value;

    if (val && val.trim() !== '') {
      this.agendaFiltrada = this.agenda.filter(function(item) {
        return item.paciente.toLowerCase().includes(val.toLowerCase());
      });
    }
    else {
      this.agendaFiltrada = this.agenda;
    }
  }

  // Detalhes do horario clicado
  detalhesHorario(horario){
    var modal = this.modalPage.create('HomeListaDetalhesPage', {horario: horario});
    modal.onDidDismiss(() => {});
    modal.present();
  }
}
