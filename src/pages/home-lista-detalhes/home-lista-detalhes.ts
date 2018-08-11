import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home-lista-detalhes',
  templateUrl: 'home-lista-detalhes.html',
})
export class HomeListaDetalhesPage {
	horario: any;
	verificaConvenioProcedimento: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
		this.horario = navParams.get('horario');
		this.verificacao();
  }

	fecharPagina(){
		this.view.dismiss();
	}

	verificacao(){
		// console.log(this.horario);
		if( this.horario.convenio != '' && this.horario.convenio != null && 
			this.horario.procedimento != '' && this.horario.procedimento != null) {

			this.verificaConvenioProcedimento = true;
		}
		else{
			this.verificaConvenioProcedimento = false;
		}
	}

}
