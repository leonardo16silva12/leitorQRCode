import { Component } from '@angular/core';
import { Historico } from '../models/Historico';
import { HistoricoService } from '../servicos/historico.service';

import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  // Variável que vai armazenar as listas do historico.
  // Vai iniciar com um array vazio para não dar erro.
  public listaHistoricos: Historico[] = [];

  constructor(
    private historicoService: HistoricoService,
  ) {
    registerLocaleData(localePtBr);
  }

  // Método que busca os históricos
  public buscarHistoricos() {
    this.listaHistoricos = [];

    // Pega tudo que estiver armazenado.
    // Após pegar tudo, é necessário subscrever
    // A função pega a lista e mapeia os dados através de cada registro
    this.historicoService.getAll().subscribe(dados => {
      this.listaHistoricos = dados.map(registro => {
        return {
        $key: registro.payload.doc.id,
        leitura: registro.payload.doc.data()['leitura'],
        dataHora: new Date(registro.payload.doc.data()['dataHora']['seconds'] * 1000)
      } as Historico;
    });
  })
}

  // Método Ciclo de Vida do Ionic
  // Toda vez que a tela for chamada, vai executar esse método.
  async ionViewWillEnter(){
    // Dessa forma, a lista estará sempre atualizada.
   await this.buscarHistoricos();
  }

  // Método para deletar o histórico.
  public deletar(key: string) {
    this.historicoService.delete(key);
    this.buscarHistoricos();
  }


}
