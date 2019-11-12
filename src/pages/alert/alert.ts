import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { DashboardPage } from '../dashboard/dashboard';
import { ManualArrivalConfirmationPage } from '../manual-arrival-confirmation/manual-arrival-confirmation';
import { ArrivalConfirmationPage } from '../arrival-confirmation/arrival-confirmation';

/**
 * Generated class for the AlertPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alert',
  templateUrl: 'alert.html',
})
export class AlertPage {

  url: string;
  data: string;
  databuilding: string;
  itemBuilding:string;
  sort:string;
  
  classSort: string = 'cls-sort cls-disp-none';
  classFilter: string = 'cls-filter cls-disp-none';
  
  keyDomainID:string = 'loginuserDomainID';
  keyAllapiDetails:string = 'loginuserApiDetails';

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public alertCtrl: AlertController, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlertPage');
    this.loadBuilding();
    this.loadUser();
  }
  
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
  
  //code start to load building for filter
  
  loadBuilding(){
  
   this.storage.get('loginUserToken').then((valloginUserToken) => {
   
    if(valloginUserToken!='')
    {
       var headers = new Headers();
       headers.append("Authorization", 'Bearer '+valloginUserToken);       
       const requestOptions = new RequestOptions({ headers: headers });
       
       this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
       
	 this.http.get('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/GetRegions', requestOptions)
	  .map(res => res.json())
	  .subscribe(data =>{                  
		  this.databuilding = data;
		  console.log(data);
	  },err => {
		  console.log(err);
	  });
      });
      
    }
   
   });
  
  }
  
  //code end to load building for filter
  
  loadUser(){ 
  
   this.storage.get('loginUserToken').then((valloginUserToken) => {
   
    if(valloginUserToken!='')
    {
       var headers = new Headers();
       headers.append("Authorization", 'Bearer '+valloginUserToken);       
       const requestOptions = new RequestOptions({ headers: headers });
       
       let postData = {
	"SortColumn": "Class,AlertSentTime asc",
	"SortDirection": "Descending"
       }
       
       this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
       
	 this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring', postData, requestOptions)
	  .map(res => res.json())
	  .subscribe(data =>{
                  this.classSort = 'cls-sort cls-disp-blck';
                  this.classFilter = 'cls-filter cls-disp-blck';
		  this.data = data;
		  console.log(data);
	  },err => {
		  console.log(err);
	  });
      });
      
    }
   
   });   
  }
  
  
  onSelectChange(selectedValue: any, itemBuilding: any) {
  
   console.log('sort value: '+selectedValue);
   console.log('filter building: '+this.itemBuilding);
   
   let regionValue='';
   
   if(this.itemBuilding)
   {
    regionValue=this.itemBuilding;
   }
   else
   {
    regionValue='null';
   }
   
   this.storage.get('loginUserToken').then((valloginUserToken) => {
   
    if(valloginUserToken!='')
    {
       var headers = new Headers();
       headers.append("Authorization", 'Bearer '+valloginUserToken);       
       const requestOptions = new RequestOptions({ headers: headers });
       
       let postData = {
	"SortColumn": selectedValue,
	"SortDirection": "Descending"
       }
       
       
       
       this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {       
	 this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring?regionID='+regionValue, postData, requestOptions)
	  .map(res => res.json())
	  .subscribe(data =>{
		  this.data = data;
		  console.log(data);
	  },err => {
		  console.log(err);
	  });
      });
      
    }
   
   });
   
  }
  
  
  
  onFilterChange(selectedFilterValue: any, sort: any) {  
   
   console.log('sort value: '+this.sort);
   console.log('filter building: '+selectedFilterValue);
   
   let selectedValue='';
   
   if(this.sort)
   {
    selectedValue=this.sort;
   }
   else
   {
    selectedValue='Class,AlertSentTime asc';
   }
   
   this.storage.get('loginUserToken').then((valloginUserToken) => {
   
    if(valloginUserToken!='')
    {
       var headers = new Headers();
       headers.append("Authorization", 'Bearer '+valloginUserToken);       
       const requestOptions = new RequestOptions({ headers: headers });
       
       let postData = {
	"SortColumn": selectedValue,
	"SortDirection": "Descending"
       }
       
       
       
       this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
       
	 this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring?regionID='+selectedFilterValue, postData, requestOptions)
	  .map(res => res.json())
	  .subscribe(data =>{
		  this.data = data;
		  console.log(data);
	  },err => {
		  console.log(err);
	  });
      });
      
    }
   
   });
   
  }
  
  
  home(){
    this.navCtrl.push(DashboardPage);
  }
  
  back(){
    this.navCtrl.push(DashboardPage);
  }
  
  arrivalConfirmation(DomainID:string, StoreID:string, DepartmentID:string, DomainName:string, StoreName:string, DepartmentName:string, Description:string){
  
  console.log(DomainID);
  console.log(StoreID);
  console.log(DepartmentID);
  
  console.log(DomainName);
  console.log(StoreName);
  console.log(DepartmentName);
  console.log(Description);
  
  this.storage.set(this.keyDomainID,DomainID+'**__**'+StoreID+'**__**'+DepartmentID);
  this.storage.set(this.keyAllapiDetails,DomainName+'**__**'+StoreName+'**__**'+DepartmentName+'**__**'+Description);
  
  
  //this.storage.set(this.keyStoreID,StoreID);
  //this.storage.set(this.keyDepartmentID,DepartmentID);
  
  
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

}
