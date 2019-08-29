import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


import { DashboardPage } from '../dashboard/dashboard';
import { SignoffPage } from '../signoff/signoff';

/**
 * Generated class for the Signoff2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signoff2',
  templateUrl: 'signoff2.html',
})
export class Signoff2Page {

  text={};
  // store ={};
  loc: any[];
  // abc={};
  // data: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
   this.text = navParams.get('data');
    
    let localData = http.get('assets/locationbak.json').map(res => res.json().locations);
    localData.subscribe(data => {
      this.loc = data;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signoff2Page');
  }
  
  dashbd(){
    this.navCtrl.push(DashboardPage);
  }
  signoff(){
    this.navCtrl.push(SignoffPage);
  }

}
