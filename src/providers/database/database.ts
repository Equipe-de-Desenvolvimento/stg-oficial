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
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(data => {
          this.databaseReady.next(true);
          this.storage.set('database_filled', true);
        })
        .catch(e => console.error(e));
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}
