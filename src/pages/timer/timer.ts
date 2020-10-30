import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';


import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Insomnia } from '@ionic-native/insomnia';


import { ArrivalConfirmationPage } from '../arrival-confirmation/arrival-confirmation';
import { TimerSignoffPage } from '../timer-signoff/timer-signoff';
import { DashboardPage } from '../dashboard/dashboard';
import { ManualArrivalConfirmationPage } from '../manual-arrival-confirmation/manual-arrival-confirmation';
import { AlertPage } from '../alert/alert';

/**
 * Generated class for the TimerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timer',
  templateUrl: 'timer.html',
})
export class TimerPage {

  public timer='';
  public min=0;
  public seconds = 0;
  
  public LoginUserapiDetails='';
  
  keytimervalue:string = 'loginUserTimerValue';
  keynfcclean:string = 'startNfcClean';
  
  url: string;
  data: string;
  
  classVariableNfcTimer: string = 'cls-timer-disp-block';

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private storage: Storage, private insomnia: Insomnia, public alertCtrl:AlertController) {
  
   this.insomnia.keepAwake()
  .then(
    () => console.log('success'),
    () => console.log('error')
   );
  
   //new section start for nfc
   
   this.storage.get('scanType').then((vall7) => {
    if(vall7=='nfc')
    {     
     this.storage.get('startNfcClean').then((valClean) => {              
      if(valClean==true)
      {
       this.classVariableNfcTimer = 'cls-timer-disp-none';
      }
      else
      {
       this.classVariableNfcTimer = 'cls-timer-disp-block';
      }
     });
    }
    else
    {     
     this.classVariableNfcTimer = 'cls-timer-disp-block';
    }
   });
   
   //new section end for nfc
  
  
   this.startTimer();
   
  
   
   
  }
    
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
  
  startTimer(){
   
   //const alertTestTime01 = this.alertCtrl.create({	
   // message: 'Time 01 start',
   // buttons: ['OK']
   //});
   //alertTestTime01.present();
  
   this.storage.get('loginUserTimerValue').then((timeVal) => {
    console.log('Current Timer Value: '+timeVal);
    
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
    
   // const alertTestTime05 = this.alertCtrl.create({	
   // message: 'print timer value: '+this.timer,
   // buttons: ['OK']
   //});
   //alertTestTime05.present();
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TimerPage');
    
    this.storage.get('startNfcClean').then((valClean7) => {
     if(valClean7)
     {      
      //const alertTestCheck = this.alertCtrl.create({	
      // message: 'NFC Start Cleaning Storage is Activated',
      // buttons: ['OK']
      //});
      //alertTestCheck.present();
     }
    });
    
    this.loadSelectedLocation();
    this.loadUser();
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
  
  loadUser(){  
  
   this.storage.get('loginuserDomainID').then((valloginuserDomainID) => {
   
    let values = valloginuserDomainID.split("**__**");
    let curDomainID = values[0];
    let curStoreID = values[1];
    let curDepartmentID = values[2];
    
    this.storage.get('loginUserToken').then((valloginUserToken) => {
    
      var headers = new Headers();
      headers.append("Authorization", 'Bearer '+valloginUserToken);       
      const requestOptions = new RequestOptions({ headers: headers });
      
      let postData = {
       "DomainID": curDomainID,
       "StoreID": curStoreID,
       "DepartmentID": curDepartmentID
      }
      
      //code start to call MetricAlertStartedCleaning api
      
      this.storage.get('loginUserTimerValue').then((timeVal) => {
       if(timeVal)
       {
        //nothing do
       }
       else
       {
         this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
         
           this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertStartedCleaning',postData,requestOptions)
            .map(res => res.json())
            .subscribe(data =>{
                    this.data = data;
                    console.log(data);
                    
                    if(data.AlreadyStarted==true)
                    {                    
                     const alert = this.alertCtrl.create({
                      title: 'Alert',
                      message: 'Somebody has already started cleaning for this location',
                      buttons:[
                       {
                        text:"OK",
                        handler:()=>
                        {
                         //this.navCtrl.push(AlertPage);
                        }
                       }
                      ]
                     
                     });
                     alert.present();
                    }
                    else
                    {
                     //this.startTimer();
                     
                     //const alertTestStartCleanAPI = this.alertCtrl.create({	
                     // message: 'Start Cleaning Api called successfully',
                     // buttons: ['OK']
                     //});
                     //alertTestStartCleanAPI.present();
                     
                     
                    }
                    
            },err => {
                    console.log(err);
            });
            
        });
      }
      
     });
     
     //code start to call MetricAlertStartedCleaning api
      
    
    });
    
   });
	
  }
  
  back(){
  
   //code to reset user timer storage value
   this.storage.set(this.keytimervalue,'');
  
    this.insomnia.allowSleepAgain()
    .then(
     () => console.log('success'),
     () => console.log('error')
    );
    
    //this.navCtrl.push(ArrivalConfirmationPage);
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
  
  home(){
  
   //code to reset user timer storage value
   this.storage.set(this.keytimervalue,'');
  
   this.insomnia.allowSleepAgain()
    .then(
     () => console.log('success'),
     () => console.log('error')
    );
    
   this.navCtrl.push(DashboardPage);
  }
  
  stopTimer(){
  
   this.insomnia.allowSleepAgain()
    .then(
     () => console.log('success'),
     () => console.log('error')
    );
    
    
    this.storage.set(this.keytimervalue,this.timer);
    
    this.navCtrl.push(TimerSignoffPage);
  }

}
