import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public formData: any = {};

  private expectativaVida: any = {
    'f': 82,
    'm': 76
  };
  private idadeAposentadoria: any = {
    'f': 62,
    'm': 65
  };

  constructor(private alertController: AlertController) {}

  calcular(form: NgForm) {
    if (form.valid) {
      let tempoRecebimentoAnos: number = this.expectativaVida[this.formData.sexo] - this.idadeAposentadoria[this.formData.sexo];
      let tempoRecebimentoMeses: number = tempoRecebimentoAnos*12;
      let montanteInvestimento: number = tempoRecebimentoMeses*this.formData.renda;
      let tempoParaPagarAnos: number = this.idadeAposentadoria[this.formData.sexo] -    this.formData.idade;
      let tempoParaPagarMeses: number = tempoParaPagarAnos*12;
      let valorContribuicaoMensal: number = montanteInvestimento / tempoParaPagarMeses;
      this.presentAlert('Resultado', 'Contribuição mensal', 'Você deve poupar R$'+valorContribuicaoMensal.toFixed(2)+' ao mês');
    }
  }

  async presentAlert(header, title, msg) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
