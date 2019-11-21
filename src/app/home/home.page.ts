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
    'f': 22.5,
    'm': 16.9
  };
  private idadeAposentadoria: any = {
    'f': 62,
    'm': 65
  };
  private rendimento: any = {
    '1': 0.0657,
    '2': 0.1036
  };

  constructor(private alertController: AlertController) {}

  calcular(form: NgForm) {
    if (form.valid) {
      let taxa: number = (Math.pow((this.rendimento[this.formData.risco]+1), 1/12)-1);
      let mesesRecebimento: number = this.expectativaVida[this.formData.sexo]*12;
      let renda: number = parseFloat(this.formData.aposentadoriaDesejada)
      let valorAcumulado = this.PV(taxa, mesesRecebimento, renda);
      let mesesPagamento: number = (this.idadeAposentadoria[this.formData.sexo] - this.formData.idade) * 12;
      let valorContribuicaoMensal = this.PGTO(valorAcumulado, mesesPagamento, taxa);
      console.log(valorContribuicaoMensal);
      // let tempoParaPagarMeses: number = (this.idadeAposentadoria[this.formData.sexo] -    this.formData.idade)*12;
      // let valorContribuicaoMensal: number = montanteInvestimento / tempoParaPagarMeses;
      this.presentAlert('Resultado', 'Contribuição mensal', 'Você deve poupar R$'+valorContribuicaoMensal.toFixed(2)+' ao mês');
    }
  }

  private PV(rate: number, nper: number, pmt: number)
  {
    return pmt / rate * (1 - Math.pow(1 + rate, -nper));
  }

  private PGTO(valor: number, prestacoes: number, juros: number)
    {
        let E: number = 1;
        let cont: number = 1;
        juros = juros / 100;

        for (let k = 1; k <= prestacoes; k++)
        {
            cont = cont * (1 + juros);
            E = E + cont;
        }
        E = E - cont;
        valor = valor * cont;

        return valor /E;
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
