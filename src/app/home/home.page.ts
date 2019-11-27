import { Component } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

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

  public form: FormGroup = new FormGroup({
    idade: new FormControl('', [Validators.required, Validators.min(1)]),
    risco: new FormControl('', [Validators.required]),
    aposentadoriaDesejada: new FormControl('', [Validators.required]),
    sexo: new FormControl('', [Validators.required])
  });

  public showErrors: boolean = false;

  constructor(private alertController: AlertController) {

  }

  private validarIdade() {
    if (this.form.value && this.form.value.sexo) {
      this.form.get('idade').setValidators([
        Validators.required, 
        Validators.min(1),
        Validators.max(this.idadeAposentadoria[this.form.value.sexo])
      ]);
      this.form.get('idade').updateValueAndValidity();
    }
  }

  public calcular() {
    this.showErrors = false;
    this.validarIdade();
    if (this.form.valid) {
      let taxa: number = (Math.pow((this.rendimento[this.form.value.risco]+1), 1/12)-1);
      let mesesRecebimento: number = this.expectativaVida[this.form.value.sexo]*12;
      let renda: number = parseFloat(this.form.value.aposentadoriaDesejada.replace('.', '').replace(',', '.'));
      let valorAcumulado = this.PV(taxa, mesesRecebimento, renda);
      let mesesPagamento: number = (this.idadeAposentadoria[this.form.value.sexo] - this.form.value.idade) * 12;
      let valorContribuicaoMensal = (this.PMT(taxa, mesesPagamento, 0, valorAcumulado, 0)*-1)/(1-0.02);
      this.presentAlert('Resultado', 'Você deve poupar R$ '+valorContribuicaoMensal.toFixed(2)+' ao mês');
    } else {
      this.showErrors = true;
      this.presentAlert('Atenção', 'Preencha corretamente todos os campos!');
    }
  }

  private PV(rate: number, nper: number, pmt: number)
  {
    return pmt / rate * (1 - Math.pow(1 + rate, -nper));
  }

  private PMT(rate: number, nper: number, pv: number, fv: number, type: number) {
    if (!fv) fv = 0;
    if (!type) type = 0;

    if (rate == 0) return -(pv + fv)/nper;

    var pvif = Math.pow(1 + rate, nper);
    var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

    if (type == 1) {
        pmt /= (1 + rate);
    };

    return pmt;
  }

  async presentAlert(title, msg) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  public limpar() {
    this.showErrors = false;
    this.form.get('idade').setValidators([Validators.required, Validators.min(1)]);
    this.form.reset({
      idade: '',
      risco: '',
      aposentadoriaDesejada: '',
      sexo: ''
    });
  }

}
