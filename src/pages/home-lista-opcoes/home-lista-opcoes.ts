import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home-lista-opcoes',
  templateUrl: 'home-lista-opcoes.html',
})
export class HomeListaOpcoesPage {
  externoLista: any = [];
  situacaoLista: any = [
    {label: "Ocupado", value: "o"},
    {label: "Livre", value: "l"},
    {label: "Faltou", value: "f"}
  ];
  parametros: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public view: ViewController) {
    this.parametros = this.navParams.get("parametros");
    this.parametros.ext_selecionados = []; //Essa atributo irá armazenar todas as informações do externo selecionado

    // Transforma a lista de externos em um json novamente
    let extList = JSON.parse(this.parametros.externoLista);
    
    for (let i = 0; i < extList.length; i++){
      if (this.parametros.externos_selecionados_id.indexOf(extList[i].externo_id) != -1) {
        this.parametros.ext_selecionados.push(extList[i]);
      }
    }

    this.externoLista = extList;
  }

  fecharPagina(){
    // console.log(this.dados);
    this.view.dismiss(this.parametros);
  }
  
  selectEmpresa(){
    let inputs = [];
    
    // Criando a estrutura dos inputs
    for (let i = 0; i < this.externoLista.length; i++) {
      
      let ext_id = this.externoLista[i].externo_id;

      inputs.push({
        type: "checkbox",
        label: this.externoLista[i].nome,
        checked:  (this.parametros.externos_selecionados_id.indexOf(ext_id) == -1) ? false : true,
        value: JSON.stringify(this.externoLista[i]) // O campo value so aceita strings
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
            // O valor de "data" é um array de strings com os values selecionados
            if(data.length > 0){
              this.parametros.ext_selecionados = [];

              for(let i = 0; i < data.length; i++){
                let json = JSON.parse(data[i]); //Transforma a string em JSON novamente
                // console.log(json);
                this.parametros.ext_selecionados.push(json);
              }
            }
          }
        }
      ]
    });

    alerta.present();
  }

  selectSituacao(){
    let inputs = [];
    
    // Criando a estrutura dos inputs
    for (let i = 0; i < this.situacaoLista.length; i++) {

      inputs.push({
        type: "radio",
        label: this.situacaoLista[i].label,
        value: this.situacaoLista[i].value
      });
    }

    // Criando o alerta
    let alerta = this.alertCtrl.create({
      title: "Selecione a situação",
      inputs: inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Ok',
          handler: (data) => { this.parametros.situacao = data }
        }
      ]
    });

    alerta.present();
  }
}
