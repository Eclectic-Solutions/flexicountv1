import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Insomnia } from '@ionic-native/insomnia';


import { ArrivalConfirmationPage } from '../arrival-confirmation/arrival-confirmation';
import { TimerSignoffPage } from '../timer-signoff/timer-signoff';
import { DashboardPage } from '../dashboard/dashboard';

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
  
  
  
  url: string;
  data: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private storage: Storage, private insomnia: Insomnia) {
  
   this.insomnia.keepAwake()
  .then(
    () => console.log('success'),
    () => console.log('error')
   );
  
  
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
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TimerPage');
    this.loadSelectedLocation();
    this.loadUser();
  }
  
  loadSelectedLocation(){
   
   this.storage.get('loginuserApiDetails').then((valloginuserApiDetails) => {
    let all_values = valloginuserApiDetails.split("**__**");
    this.LoginUserapiDetails = all_values[3]+' - '+all_values[1]+' - '+all_values[2];
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
      
      this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
      
	this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertStartedCleaning',postData,requestOptions)
	 .map(res => res.json())
	 .subscribe(data =>{
		 this.data = data;
		 console.log(data);
	 },err => {
		 console.log(err);
	 });
	 
     });
      
    
    });
    
   });
	
  }
  
  back(){
  
    this.insomnia.allowSleepAgain()
    .then(
     () => console.log('success'),
     () => console.log('error')
    );
    
    this.navCtrl.push(ArrivalConfirmationPage);
  }
  
  home(){
  
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
    
    this.navCtrl.push(TimerSignoffPage);
  }

}
