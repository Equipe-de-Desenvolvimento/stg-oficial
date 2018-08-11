import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class WebserviceProvider {

  constructor(public http: Http) {
    console.log('Hello WebserviceProvider Provider');
  }

  verificaLinkExterno(externo){
    var url = externo.endereco + "app/validaUsuario?usuario="+externo.usuario+"&pw="+externo.senha;

    // Faz uma requisição GET para o endereco informado e verifica se os dados de login estão corretos
    return this.http.get(url)
    .map((res) => { 
      var resposta = res.json(); // Transforma a resposta do servidor em um JSON
      
      var retorno = { // Variável que irá armazenar o resultado da verificacao do link
        status: "", 
        mensagem: "",
        dados: {
          hash_senha:"",
          operador_id: ""
        }
      };

      if (resposta != undefined){
        if(resposta.status == 'sucesso') {
          retorno.status = "sucesso"
          retorno.dados = {
            // empresas_id: resposta.empresas_id,
            hash_senha: resposta.hashSenha,
            operador_id: resposta.operador_id
          };
        }
        else {
          retorno.status = "erro"
          retorno.mensagem = resposta.motivo;
        }
      }
      else{
        retorno.status = "erro"
        retorno.mensagem = "Não foi possivel estabelecer conexão com: " + externo.endereco;
      }
      // Retorna o resultado da verificacao
      return retorno;
    })
    .catch( (error: Response | any) => {
      return Observable.throw(error.json().error || "Erro no Servidor.");
    });
  }

  buscaAgendaLista(parametros){
    var url = parametros.endereco + "app/buscandoAgenda?operador_id="+parametros.operador_id+"&paciente="+parametros.paciente+"&situacao="+parametros.situacao+"&data="+parametros.data+"&externoNome="+parametros.externoNome;

    // Faz uma requisição GET para o endereco informado
    return this.http.get(url)
    .map((res) => { 
      var resposta = res.json(); // Transforma a resposta do servidor em um JSON
      return resposta;
    })
    .catch( (error: Response | any) => {
      return Observable.throw(error.json().error || "Erro no Servidor.");
    });
  }

}
