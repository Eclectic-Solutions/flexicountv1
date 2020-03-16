import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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

  public timer='';
  public min=0;
  public seconds = 0;
  
  

  public LoginUserapiDetails='';
  keytimervalue:string = 'loginUserTimerValue';
  keytimervalueBackground:string = 'loginUserTimerValueBackground';

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private storage: Storage, public alertCtrl:AlertController) {
  
   this.startTimer();
   
  }
  
  //timer js code start
  
  startTimer(){
  
   this.storage.get('loginUserTimerValue').then((timeVal) => {
    console.log('Current Timer Value: '+timeVal);
    
    const alert9 = this.alertCtrl.create({
      title: 'saved time in timer-off',
      message: 'savedtime=> '+timeVal,
      buttons: ['OK']
    });
    alert9.present();
    
    if(timeVal)
    {
     var hms = timeVal;   // your input string
     var a = hms.split(':'); // split it at the colons

     // minutes are worth 60 seconds. Hours are worth 60 minutes.
     var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
     seconds--;
     
     console.log(seconds);
     this.seconds = seconds;
    }
    
   });
  
  
  
  
   var intervalVar=setInterval(function(){
   
   //alert('hi');
   this.seconds++;
   this.secondsToString();
   //this.min++;
   
   }.bind(this),1000)
  }
  
  secondsToString()
  {
    var seconds = this.seconds;
    
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    
    var numhours_print = ("0" + numhours).slice(-2);
    var numminutes_print = ("0" + numminutes).slice(-2);
    var numseconds_print = ("0" + numseconds).slice(-2);
    
    //this.timer = numhours + ":" + numminutes + ":" + numseconds;
    this.timer = numhours_print + ":" + numminutes_print + ":" + numseconds_print;
    this.storage.set(this.keytimervalueBackground,this.timer);
  }
  
  //timer js code end

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimerSignoffPage');
    this.loadSelectedLocation();
  }
  
  
  loadSelectedLocation(){
   
   this.storage.get('loginuserApiDetails').then((valloginuserApiDetails) => {
    let all_values = valloginuserApiDetails.split("**__**");
    
    let first_value = '';
    
    if(all_values[3]=='null')
    {
     first_value = all_values[0];
    }
    else
    {
     first_value = all_values[3];
    }
    
    this.LoginUserapiDetails = first_value+' - '+all_values[1]+' - '+all_values[2];
   });
  
  }
  
  home(){
  
    //code to reset user timer storage value
    this.storage.set(this.keytimervalue,'');
    this.storage.set(this.keytimervalueBackground,'');
  
    this.navCtrl.push(DashboardPage);
  }
  
  back(){
    //this.navCtrl.push(TimerPage);
    this.storage.get('alertTimerSettings').then((val7) => {
    
     if(val7==true)
     {
      //redirect to the next page ie Timer Page
      this.storage.set(this.keytimervalue,this.timer);
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
   this.storage.set(this.keytimervalueBackground,'');
    
   this.navCtrl.push(CompletionSummaryPage);
  }

}
