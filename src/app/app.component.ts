import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'HomePage'; // Define a pagina principal

  @ViewChild(Nav) nav: Nav;

  // Array com as opções que irão ficar disponiveis no Menu
  pages: any = [
    {titulo: "Agenda",   componente: 'HomePage'},
    {titulo: "Externos", componente: 'ExternoPrincipalPage'}
    //Criar uma pagina de Help!
  ];

  constructor(platform: Platform, public menu: MenuController) {
    platform.ready().then(() => {
      
    }).catch((err) => {});
  }

  mudarPagina(pagina){
    this.menu.close(); // Fechando o menu
    this.nav.setRoot(pagina.componente); // Setando como Pagina Principal o item selecionado
  }
}

