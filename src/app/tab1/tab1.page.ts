import { Component, ChangeDetectorRef } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  // Criação de algumas variáveis globais para controlar a leitura do scanner
  
  // Armazenar o leitor para depois desativar.
  public leitorQRCode: any;

  // Para exibir a câmera, guardando o corpo da página.
  public content: HTMLElement;

  // Para exibir a câmera, guardando o logo.
  public imgLogo: HTMLElement;

  // Para exibir o câmera, guardando o footer.
  public footer: HTMLElement;

  public leitura: string;

  public link = false;




  constructor(
    private qrScanner: QRScanner,
    public alertController: AlertController,
    public platform: Platform,
    private screenOrientation: ScreenOrientation,
    private cdRef: ChangeDetectorRef,
  ) {

    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.platform.backButton.subscribeWithPriority(0, () => {

        //Devolvendo a opacidade ao content.
        this.content.style.opacity = '100';
        this.imgLogo.style.opacity = '100';
        this.footer.style.opacity = '100';

        // Zerar variável
        this.leitura = null;
        this.link = false;

        //Ocultar a câmera.
         this.qrScanner.hide();
         //Parar o scanner.
         this.leitorQRCode.unsubscribe();

    });

  }

  // Método para ler o código do QR Code
  public lerQRCode() {

    //Chama e prepara para a leitura.
this.qrScanner.prepare()

    //Se der certo, ele vai pegar o status.
  .then((status: QRScannerStatus) => {
    
    // Se o status for autorizado, então vai realizar a leitura.
     if (status.authorized) {

      //Armazenando o corpo da página na váriavel content.
      //o "as HTMLElement" é para garantir que vai retornar um HTML.
      this.content = document.getElementsByTagName('ion-content')[0] as HTMLElement;
      this.imgLogo = document.getElementById('logo') as HTMLElement;
      this.footer = document.getElementById('footer') as HTMLElement;


      //Deixando a página transparente.
      this.content.style.opacity = '0';
      this.imgLogo.style.opacity = '0';
      this.footer.style.opacity = '0';


      //Chamar a câmera.
      this.qrScanner.show();

      //Recebendo a leitura.
      //Quando encontrar algo, ele vai subscrever um texto do tipo string.
       this.leitorQRCode = this.qrScanner.scan().subscribe((text: string) => {
        
        // Gravando a leitura na variável "leitura" e realizando um if ternário para garantir que
        // tanto no browser quanto no android, a variável irá receber o valor.
        this.leitura = (text['result']) ? text['result'] : text;
        

        //Devolvendo a opacidade ao content.
        this.content.style.opacity = '100';
        this.imgLogo.style.opacity = '100';
        this.footer.style.opacity = '100';

        //Ocultar a câmera.
         this.qrScanner.hide();
         //Parar o scanner.
         this.leitorQRCode.unsubscribe();

        //  this.presentAlert('Leitura: ', this.leitura);

        // O link irá passar pela filtragem.
        this.verificaLink(this.leitura);

        // Verifica se houve modificações nas variáveis.
        this.cdRef.detectChanges();

       });

     } else if (status.denied) {
      this.presentAlert('Aviso', 'Permissão de acesso à câmera negada.');
     } else {
      this.presentAlert('Aviso', 'Não foi possível processar sua solicitação, tente novamente mais tarde.');
     }
  })
  .catch((e: any) => console.log('ERRO', e));
  }

  // Método assíncrono que mostra alert na tela.
  async presentAlert(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Método para saber se a variável "leitura" é um link.
  public verificaLink(texto: string) {
    
    // Cria uma variável e recebe as 4 primeiras letras do texto recebido.
    const inicio = texto.substring(0, 4);

    // Se a variável for igual um dos dois começos de link, então:
    if(inicio == 'www.' || inicio == 'http') {
      // O link é verdadeiro, ou seja, foi passado um link real.
      this.link = true;
    } else {
      // O link é falso, ou seja, foi passado um link inválido.
      this.link = false;
    }

  }






}
