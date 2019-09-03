import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

import { Signoff2Page } from '../signoff2/signoff2';

/**
 * Generated class for the SignoffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signoff',
  templateUrl: 'signoff.html',
})
export class SignoffPage {

  data={};
  option:BarcodeScannerOptions;

  constructor(public navCtrl: NavController, public navParams: NavParams, public barcodeScaner: BarcodeScanner) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignoffPage');
  }
  
  scan2(){
     this.option={
       prompt: "Focus the QR code in the window below to sign off cleaning"
     }
     this.barcodeScaner.scan(this.option).then(barcodeData => {
       console.log(barcodeData);
       this.data = barcodeData;
       this.navCtrl.push(Signoff2Page, { data: barcodeData.text });
      })
     
      .catch(err => {
          console.log('Error', err);
      });
   }
   
   signoff2(){
    this.navCtrl.push(Signoff2Page);
  }

}
