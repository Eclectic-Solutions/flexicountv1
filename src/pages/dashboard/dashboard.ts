import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';
import { AlertPage } from '../alert/alert';
import { SettingsPage } from '../settings/settings';
import { SignoffPage } from '../signoff/signoff';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http,private alertController:AlertController, public platform: Platform, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }
  
  alertpg(){
   this.navCtrl.push(AlertPage);
  }
  
  logout(){
   this.navCtrl.push(HomePage);    
  }
  
  settingpg(){
    this.navCtrl.push(SettingsPage);
  }
  
  signoffpg(){
    this.navCtrl.push(SignoffPage);
  }

}
