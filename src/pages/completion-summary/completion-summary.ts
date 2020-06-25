import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';


import { DashboardPage } from '../dashboard/dashboard';
import { TimerSignoffPage } from '../timer-signoff/timer-signoff';
import { AlertPage } from '../alert/alert';



/**
 * Generated class for the CompletionSummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-completion-summary',
  templateUrl: 'completion-summary.html',
})
export class CompletionSummaryPage {

  url: string;
  data: string;
  
  keyDomainID:string = 'loginuserDomainID';
  keyAllapiDetails:string = 'loginuserApiDetails';
  
  public LoginUserapiDetails='';
  
  keynfcclean:string = 'startNfcClean';
  keytimervalue:string = 'loginUserTimerValue';

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private storage: Storage) {
  }
  
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompletionSummaryPage');
    this.loadUser();
    this.loadSelectedLocation();
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
	this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertCompletedCleaning',postData,requestOptions)
	 .map(res => res.json())
	 .subscribe(data =>{
		 this.data = data;
		 //console.log(data);
	 },err => {
		 //console.log(err);
	 });
	 
     });
      
    
    });
    
    //code to clear startNfcClean
    
    this.storage.get('startNfcClean').then((valClean7) => {
     if(valClean7)
     {
      this.storage.set(this.keynfcclean,false);
      this.storage.set(this.keytimervalue,'');
     }
    });
    
    
    
   });
   
    
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
    this.navCtrl.push(DashboardPage);
  }
  
  back(){
    this.navCtrl.push(TimerSignoffPage);
  }
  
  signOffAnotherLocation(){
  
   //remove all temporary data from local storage
   
   this.storage.set(this.keyDomainID,'');
   this.storage.set(this.keyAllapiDetails,'');
  
  
   this.navCtrl.push(AlertPage);
  }

}
