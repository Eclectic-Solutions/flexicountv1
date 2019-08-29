import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { DashboardPage } from '../dashboard/dashboard';
import { AlertPage } from '../alert/alert';
import { TimerPage } from '../timer/timer';
import { TimerSignoffPage } from '../timer-signoff/timer-signoff';

/**
 * Generated class for the ManualArrivalConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manual-arrival-confirmation',
  templateUrl: 'manual-arrival-confirmation.html',
})
export class ManualArrivalConfirmationPage {

  public LoginUserapiDetails='';
  data: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManualArrivalConfirmationPage');
    this.loadSelectedLocation();
  }
  
  loadSelectedLocation(){
   
   this.storage.get('loginuserApiDetails').then((valloginuserApiDetails) => {
    let all_values = valloginuserApiDetails.split("**__**");
    this.LoginUserapiDetails = all_values[3]+' - '+all_values[1]+' - '+all_values[2];
   });  
  }
  
  manualConfirmation(){
    this.storage.get('alertTimerSettings').then((val1) => {
    
      if(val1==true)
      {
        //redirect to the next page ie Timer Page
        this.navCtrl.push(TimerPage);
      }
      else
      {
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
        
        //redirect to the next page of the Timer Page ie Timer Page
        this.navCtrl.push(TimerSignoffPage);
      }
    
    });
  }
  
  home(){
    this.navCtrl.push(DashboardPage);
  }
  
  back(){
    this.navCtrl.push(AlertPage);
  }

}
