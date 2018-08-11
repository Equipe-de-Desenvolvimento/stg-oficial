import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class DatabaseProvider {  

  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public http: Http, public sqlitePorter: SQLitePorter, private sqlite: SQLite, private platform: Platform, private storage: Storage) {
    this.databaseReady = new BehaviorSubject(false);
    // Garante que o acesso ao banco de dados só será feito após os modulos "estarem completamente carregados"
    this.platform.ready().then(() => {

      this.sqlite.create({
        name: "stg.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        // Evita tentativa de inicialização do banco sempre que o app for aberto
        this.storage.get('database_inicializado').then(val => {
          if (val) this.databaseReady.next(true);
          else this.inicializaDatabase();
        });
      });
    });
  }

  inicializaDatabase(){
    this.http.get('assets/inicializacao.sql') // Busca o conteudo do arquivo de inicialização do banco e executa
    .map(res => res.text())
    .subscribe(sql => {
      // Executa o script no banco
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(data => {
          this.databaseReady.next(true);
          this.storage.set('database_filled', true);
        })
        .catch(e => console.error(e));
    });
  }

  listaEnderecosExternos(){
    return this.database.executeSql("SELECT * FROM tb_externo", [])
    .then((data) => {
      // this.databaseReady.next(true);
      let result = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          var empresas_id = (data.rows.item(i).empresas_id != '') ? JSON.parse(data.rows.item(i).empresas_id) : {};
          result.push({
            externo_id: data.rows.item(i).externo_id,
            operador_id: data.rows.item(i).operador_id,
            nome: data.rows.item(i).nome,
            usuario: data.rows.item(i).usuario,
            senha: data.rows.item(i).senha,
            endereco: data.rows.item(i).endereco,
            empresas_id: empresas_id
          });
        }
      }
      return result;
    }, (err) => {
      console.log('Error: ', err);
      return [];
    })
    .catch((err) => {
      console.log('Error: ', err);
      return [];
    });
  }

  adicionaEnderecoExterno(externo) {
    var valores = [externo.endereco, externo.nome, externo.usuario, externo.senha, externo.empresas_id, externo.operador_id];
    return this.database.executeSql("INSERT INTO tb_externo (endereco, nome, usuario, senha, empresas_id, operador_id) VALUES (?, ?, ?, ?, ?, ?)", valores)
    .then((data) => { 
      // this.databaseReady.next(true); 
      return true; 
    }, (err) => { return false; })
    .catch((err) => { return false; });
  }

  atualizaEnderecoExterno(externo) {
    var valores = [externo.endereco, externo.nome, externo.usuario, externo.senha, externo.empresas_id, externo.operador_id, externo.externo_id];
    return this.database.executeSql("UPDATE tb_externo SET endereco = ?, nome = ?, usuario = ?, senha = ?, empresas_id = ?, operador_id = ? WHERE externo_id = ?", valores)
    .then((data) => { 
      // this.databaseReady.next(true);
      return true; 
    }, (err) => { return false; })
    .catch((err) => { return false; });
  }

  removeEnderecoExterno(externo_id) {
    // Remove primeiro os registros na tabela de agenda associados a esse externo
    return this.database.executeSql("DELETE FROM tb_agenda WHERE externo_id = ?", [externo_id])
    .then((data) => { 
      return this.deleteEnderecoExterno(externo_id).then(() => {
        // this.databaseReady.next(true);
        return true;
      }).catch(() => false); 
    }, (err) => { return false; })
    .catch((err) => { return false; });
  }

  deleteEnderecoExterno(externo_id) {
    // Remove o registro da tabela tb_externo
    return this.database.executeSql("DELETE FROM tb_externo WHERE externo_id = ?", [externo_id])
    .then((data) => { 
      // this.databaseReady.next(true);
      return true; 
    }, (err) => { return false; })
    .catch((err) => { return false; });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}
