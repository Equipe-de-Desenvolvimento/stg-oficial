import { Component } from '@angular/core';
import { IonicPage, ModalController,  NavController, NavParams, AlertController } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-externo-principal',
  templateUrl: 'externo-principal.html',
})
export class ExternoPrincipalPage {
  
  public externoLista: any[];

  constructor(public modal: ModalController, public navCtrl: NavController, public navParams: NavParams, public database: DatabaseProvider, public alertCtrl: AlertController) {
    // Faz uma busca no banco por todos os externos cadastrados
    this.database.listaEnderecosExternos().then(data => { this.externoLista = data; });
  }

  ionViewDidLoad() {
  }

  adicionarExterno(){
    var pageNovoExterno = this.modal.create('ExternoAdicionarPage');
    pageNovoExterno.onDidDismiss(() => {
      // Atualiza a page atual
      this.navCtrl.setRoot(this.navCtrl.getActive().component)
    });
    pageNovoExterno.present();
  }

  editarExterno(externo){
    var pageEditarExterno = this.modal.create('ExternoEditarPage', {externo: externo});
    pageEditarExterno.onDidDismiss(() => {
      // Atualiza a page atual
      this.navCtrl.setRoot(this.navCtrl.getActive().component)
    });
    pageEditarExterno.present();
  }

  confirmacaoExcluirExterno(externo_id){
    let alerta = this.alertCtrl.create({
      title: "Atenção",
      subTitle: "Deseja realmente excluir o item selecionado?",
      buttons: ["Não", {
        text: "Sim",
        handler: () => { // Quando o botão "Sim" é apertado essa função é disparada
          this.excluirExterno(externo_id);
        }
      }]
    });
    alerta.present()
  }

  excluirExterno(externo_id){
    // Exclui esse externo e todos os agendamentos salvos que estão associados a ele
    this.database.removeEnderecoExterno(externo_id)
    .then((removido) => {
      if (removido) {
        // Mostrando o alerta avisando que tudo ocorreu bem
        this.mostraAlerta('Sucesso!', "Removido com sucesso.");
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
      else {
        // Mostrando o alerta em caso de erro
        this.mostraAlerta('Erro!', "Erro ao remover.");
      }
    })
    .catch(() => {
      // Mostrando o alerta em caso de erro
      this.mostraAlerta('Erro!', "Erro ao remover.");
    });
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

  // Função para reduzir a quantidade de caracteres que é mostrado da url do externo
  trechoEndereco(endereco){
    if(endereco.length <= 30){
      return endereco
    }
    else{
      return endereco.substr(0, 25) + "(...)";
    }
  }


}
