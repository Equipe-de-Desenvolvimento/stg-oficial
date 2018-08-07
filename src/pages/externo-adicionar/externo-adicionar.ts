import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { WebserviceProvider } from "./../../providers/webservice/webservice";
import { DatabaseProvider } from './../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-externo-adicionar',
  templateUrl: 'externo-adicionar.html',
})
export class ExternoAdicionarPage {
  // Variavel usada na validação do formulario
  erroValidacao: any = {
    // Quando algum dos atributos abaixo for setado para true irá aparecer a mensagem avisando que o campo é obrigatório
    nome: false,
    endereco: false,
    usuario: false,
    senha: false
  };

  // Variavel que irá armazenar os dados do formulario
  dadosForm: any = {
    nome: "",
    endereco: "",
    usuario: "",
    senha: ""
  };

  // Variavel de controle do formulario
  externoForm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public view: ViewController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public webservice: WebserviceProvider, public database: DatabaseProvider) {
    // Define os campos obrigatórios
    this.externoForm = formBuilder.group({
      // O nome dos parametros aqui devem ser iguais aos valores do atributo formControlName
      nome: ['', Validators.required], 
      endereco: ['', Validators.required],
      usuario: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  validaFormulario(){
    let { nome, endereco, usuario, senha } = this.externoForm.controls;
 
    if (!this.externoForm.valid) { // Caso o formulario não esteja com todos os campos preenchidos, ele entra aqui
      if (!nome.valid) this.erroValidacao.nome = true;
      else this.erroValidacao.nome = false;

      if (!endereco.valid) this.erroValidacao.endereco = true;
      else this.erroValidacao.endereco = false;

      if (!usuario.valid) this.erroValidacao.usuario = true;
      else this.erroValidacao.usuario = false;

      if (!senha.valid) this.erroValidacao.senha = true;
      else this.erroValidacao.senha = false;
    }
    else {
      this.gravarExterno(this.dadosForm);
    }
  }

	gravarExterno(formulario) {
    var externo = {
      nome: formulario.nome,
      endereco: this.trataUrlEnderecoExterno(formulario.endereco),
      operador_id: "",
      usuario: formulario.usuario,
      senha: formulario.senha,
      empresas_id: "",
    };

    // Fazendo a animação de carregando
		let loadingEffect = this.loadingCtrl.create({
			content: 'Aguarde um momento...'
    });
    loadingEffect.present();

    // Verifica se as informações que a pessoa informou estão corretas
    this.webservice.verificaLinkExterno(externo).subscribe(
      (resultado) => {
        /* Tirando o efeito de loading */
        loadingEffect.dismiss();

        // Verifica se o webservice retornou o objeto com as informações da solicitação
        // ou o Observable com erro de requisição
        if ( resultado.hasOwnProperty("status") && resultado.status !== "" ) {
          
          if ( resultado.status == 'sucesso' ){
            // console.log('WTF? why you here?');
            externo.senha = resultado.dados.hash_senha;
            externo.operador_id = resultado.dados.operador_id;
            externo.empresas_id = "";
            // Salvando no Banco 
            this.database.adicionaEnderecoExterno(externo)
            .then((inserted) => {
              if (inserted) {
                // Mostrando o alerta avisando que tudo ocorreu bem
                this.mostraAlerta('Sucesso!', "Endereço adicionado com sucesso.");
                this.view.dismiss(); // Faz com que o app volte para a lista de End. Externos
              }
              else {
                // Mostrando o alerta em caso de erro
                this.mostraAlerta('Erro!', "Erro ao gravar as informações.");
              }
            })
            .catch(() => {
              // Mostrando o alerta em caso de erro
              this.mostraAlerta('Erro!', "Erro ao gravar as informações.");
            });
          }
          else {
            // Mostrando o alerta em caso de erro
            this.mostraAlerta('Erro!', resultado.mensagem);
          }
        } 
        else {
          // Mostrando o alerta em caso de erro
          this.mostraAlerta('Erro!', "Não foi possivel se conectar ao servidor.");
        }
      },
      (erro) => {
        /* Tirando o efeito de loading */
        loadingEffect.dismiss();
        // Mostrando o alerta em caso de erro
        this.mostraAlerta('Erro!', "Não foi possivel se conectar ao servidor.");
      }
    );
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

  // Trata o endereço digitado para que este contenha o http:// no inicio e termine com /
  trataUrlEnderecoExterno(url){
    var link = url.toLowerCase().replace(" ","");
		if (link.substr(0, 4) != 'http'){
			link = 'http://' + link;
		}
		if (link.substr(-1, 1) != '/'){
			link += '/';
    }
    return link;
  }

	fecharPagina(){
		this.view.dismiss();
	}

}
