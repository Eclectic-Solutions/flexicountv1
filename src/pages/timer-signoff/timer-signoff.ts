import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';


import { DashboardPage } from '../dashboard/dashboard';
import { TimerPage } from '../timer/timer';
import { CompletionSummaryPage } from '../completion-summary/completion-summary';
import { ManualArrivalConfirmationPage } from '../manual-arrival-confirmation/manual-arrival-confirmation';
import { ArrivalConfirmationPage } from '../arrival-confirmation/arrival-confirmation';



/**
 * Generated class for the TimerSignoffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timer-signoff',
  templateUrl: 'timer-signoff.html',
})
export class TimerSignoffPage {

  public LoginUserapiDetails='';
  keytimervalue:string = 'loginUserTimerValue';

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimerSignoffPage');
    this.loadSelectedLocation();
  }
  
  
  loadSelectedLocation(){
   
   this.storage.get('loginuserApiDetails').then((valloginuserApiDetails) => {
    let all_values = valloginuserApiDetails.split("**__**");
    this.LoginUserapiDetails = all_values[3]+' - '+all_values[1]+' - '+all_values[2];
   });
  
  }
  
  home(){
  
    //code to reset user timer storage value
    this.storage.set(this.keytimervalue,'');
  
    this.navCtrl.push(DashboardPage);
  }
  
  back(){
    //this.navCtrl.push(TimerPage);
    this.storage.get('alertTimerSettings').then((val7) => {
    
     if(val7==true)
     {
      //redirect to the next page ie Timer Page
      this.navCtrl.push(TimerPage);
     }
     else
     {
       this.storage.get('alertScanQrSettings').then((val) => {
         //check wheather QRScan settings is on or off
         if(val==true)
         {
          this.navCtrl.push(ArrivalConfirmationPage);
         }
         else
         {     
          this.navCtrl.push(ManualArrivalConfirmationPage);     
         }    
       });
     }
     
    });
  }
  
  completion_summary(){
  
   //code to reset user timer storage value
   this.storage.set(this.keytimervalue,'');
    
   this.navCtrl.push(CompletionSummaryPage);
  }

}
