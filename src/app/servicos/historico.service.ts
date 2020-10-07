import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Historico } from '../models/Historico';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  constructor(
    private afs: AngularFirestore,
  ) { }

    // Create = Inserir dados na aplicação.
    // Chamar variável histórico importando do model Historico.
    public create(historico: Historico) {
      // Collection seria como se fosse a tabela, nesse comando se dá o nome da coleção.
      // o ...historico serve para desconstruir, porque na hora que faz a adição 
      // ele vai colocar cada campo em seu lugar.
      return this.afs.collection('historicos').add({...historico});
    }

    // Get = Buscar todos os registros.
    public getAll() {
      // O snapshotChanges vai verificar as últimas atualizações.
      return this.afs.collection('historicos').snapshotChanges();
    }

    // Update = Atualizar os registros.
    // Recebe a chave e o historico.
    public update(key: string, historico: Historico) {
      // O doc vem porque estamos trabalhando apenas com um elemento.
      // Recebe o key do histórico que irá ser alterado.
      return this.afs.doc(`historicos/${key}`).update(historico);
    }

    // Delete = Deleta os registros.
    // Recebe a chave.
    public delete(key: string) {
      // Recebe o key do histórico que irá ser deletado.
      return this.afs.doc(`historicos/${key}`).delete();
    }






}
