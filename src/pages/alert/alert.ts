import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

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
  //filtredBuildingValue:string='null';
  
  loader: any;
  
  classSort: string = 'cls-sort cls-disp-none';
  classFilter: string = 'cls-filter cls-disp-none';
  
  keyDomainID:string = 'loginuserDomainID';
  keyAllapiDetails:string = 'loginuserApiDetails';
  public loading;
  
  //declare storage variable for building filter
  keyBuildingFilter:string = 'BuildingFilterValue';
  
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public alertCtrl: AlertController, private storage: Storage, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlertPage');
    
    this.createDisplayLoading();
    
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
  
  
  //code start to show & hide loading popup
  
  createDisplayLoading(){
  
   this.loader = this.loadingCtrl.create({  
    content : "Loading..."   
   });  
   this.loader.present();
   
  }
  
  hideLoader()
  {
   this.loader.dismiss();
  }
  
  //code end to show & hide loading popup
  
  
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
		  
		  //code to set item building filter dropdown value
		  
		  this.storage.get('BuildingFilterValue').then((valBuildingFilter) => {
		    console.log('building filter value at storage: '+valBuildingFilter);
		    if(valBuildingFilter)
		    {       
		     console.log('valBuildingFilter: '+valBuildingFilter);
		     this.itemBuilding=valBuildingFilter;
		    }
		    else
		    {
		     this.itemBuilding='null';
		    }
		  });
		  
		  //this.itemBuilding='null';
		  
		  
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
     this.storage.get('BuildingFilterValue').then((valBuildingFilter) => {
      console.log('building filter value at storage: '+valBuildingFilter);
      if(valBuildingFilter)
      {
       var headers = new Headers();
       headers.append("Authorization", 'Bearer '+valloginUserToken);       
       const requestOptions = new RequestOptions({ headers: headers });
       
       let postData = {
	"SortColumn": "Class desc,AlertSentTime",
	"SortDirection": "Descending",
	"regionID": valBuildingFilter
       }
       
       this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
       
	 this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring', postData, requestOptions)
	  .map(res => res.json())
	  .subscribe(data =>{
                  this.classSort = 'cls-sort cls-disp-blck';
                  this.classFilter = 'cls-filter cls-disp-blck';
		  this.data = data;
		  console.log(data);
                  this.hideLoader();
	  },err => {
		  console.log(err);
	  });
       });
      }
      else
      {
       var headers = new Headers();
       headers.append("Authorization", 'Bearer '+valloginUserToken);       
       const requestOptions = new RequestOptions({ headers: headers });
       
       let postData = {
	"SortColumn": "Class desc,AlertSentTime",
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
                  this.hideLoader();
	  },err => {
		  console.log(err);
	  });
       });
      }
    });
   
   }
   
   });   
  }
  
  /*
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
   
   this.createDisplayLoading();
   
   this.storage.get('loginUserToken').then((valloginUserToken) => {
   
    if(valloginUserToken!='')
    {
       var headers = new Headers();
       headers.append("Authorization", 'Bearer '+valloginUserToken);       
       const requestOptions = new RequestOptions({ headers: headers });
       
       let postData = {
	"SortColumn": selectedValue,
	"SortDirection": "Descending",
        "regionID": regionValue
       }
       
       
       
       this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {       
	 this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring', postData, requestOptions)
	  .map(res => res.json())
	  .subscribe(data =>{
		  this.data = data;
		  console.log(data);
                  this.hideLoader();
	  },err => {
		  console.log(err);
	  });
      });
      
    }
   
   });
   
  }
  
  */
  
  //new code logic start
  
  onSelectChange(selectedValue: any, itemBuilding: any) {
  
   console.log('sort value: '+selectedValue);
   console.log('filter building: '+this.itemBuilding);
   
   let regionValue='';
   let postData='';
   let lastChar='';
   
   if(this.itemBuilding)
   {
    regionValue=this.itemBuilding;
   }
   else
   {
    regionValue='null';
   }
   
   this.createDisplayLoading();
   
   this.storage.get('loginUserToken').then((valloginUserToken) => {
   
    if(valloginUserToken!='')
    {
       let lastChar = selectedValue[selectedValue.length -1];
       
       var headers = new Headers();
       headers.append("Authorization", 'Bearer '+valloginUserToken);       
       const requestOptions = new RequestOptions({ headers: headers });
       
       /*let postData = {
	"SortColumn": selectedValue,
	"SortDirection": "Descending",
        "regionID": regionValue
       }*/
       
       if(lastChar=='1')
       {
	 console.log('last char 1');
	 let postData = {
	  "SortColumn": 'Class desc,AlertSentTime',
	  "SortDirection": "Ascending",
	  "regionID": regionValue
	 }
	
	 this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {       
	  this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring', postData, requestOptions)
	   .map(res => res.json())
	   .subscribe(data =>{
		   this.data = data;
		   console.log(data);
		   this.hideLoader();
	   },err => {
		   console.log(err);
	   });
	});
       }
       else
       {
	 console.log('last char 2');
	 let postData = {
	  "SortColumn": selectedValue,
	  "SortDirection": "Descending",
	  "regionID": regionValue
	 }
	
	 this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {       
	   this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring', postData, requestOptions)
	    .map(res => res.json())
	    .subscribe(data =>{
		    this.data = data;
		    console.log(data);
		    this.hideLoader();
	    },err => {
		    console.log(err);
	    });
	 });
       }
       
       
       
       /*
       this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {       
	 this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring', postData, requestOptions)
	  .map(res => res.json())
	  .subscribe(data =>{
		  this.data = data;
		  console.log(data);
                  this.hideLoader();
	  },err => {
		  console.log(err);
	  });
      });
      */
      
    }
   
   });
   
  }
  
  //new code logic end
  
  
  /*
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
    selectedValue='Class desc,AlertSentTime';
   }
   
   this.createDisplayLoading();
   
   this.storage.get('loginUserToken').then((valloginUserToken) => {
   
    if(valloginUserToken!='')
    {
       var headers = new Headers();
       headers.append("Authorization", 'Bearer '+valloginUserToken);       
       const requestOptions = new RequestOptions({ headers: headers });
       
       let postData = {
	"SortColumn": selectedValue,
	"SortDirection": "Descending",
        "regionID": selectedFilterValue
       }
       
       
       
       this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
       
	 this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring', postData, requestOptions)
	  .map(res => res.json())
	  .subscribe(data =>{
		  this.data = data;
		  console.log(data);
                  this.hideLoader();
	  },err => {
		  console.log(err);
	  });
      });
      
    }
   
   });
   
  }
  */
  
  //new code logic start
  
  onFilterChange(selectedFilterValue: any, sort: any) {  
   
   console.log('sort value1: '+this.sort);
   console.log('filter building1: '+selectedFilterValue);
   
   //code start=> store selected building value in storage
   this.storage.set(this.keyBuildingFilter,selectedFilterValue);              
   
   let selectedValue='';
   let postData='';   
   //let lastChar1 = this.sort[this.sort.length -1];
   let lastChar1 = '';
   
   if(this.sort)
   {
    let lastChar1 = this.sort[this.sort.length -1];
    if(lastChar1=='1')
    {
     console.log('last char 1');
     selectedValue='Class desc,AlertSentTime';
    }
    else
    {
     console.log('last char 2');
     selectedValue=this.sort;
    }
   }
   else
   {
    selectedValue='Class desc,AlertSentTime';
   }
   
   this.createDisplayLoading();
   
   this.storage.get('loginUserToken').then((valloginUserToken) => {
   
    if(valloginUserToken!='')
    {
       var headers = new Headers();
       headers.append("Authorization", 'Bearer '+valloginUserToken);       
       const requestOptions = new RequestOptions({ headers: headers });
       
       if(lastChar1=='1')
       {
	 let postData = {
	 "SortColumn": selectedValue,
	 "SortDirection": "Ascending",
	 "regionID": selectedFilterValue
	}
	
	this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
       
	   this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring', postData, requestOptions)
	    .map(res => res.json())
	    .subscribe(data =>{
		    this.data = data;
		    console.log(data);
		    this.hideLoader();
	    },err => {
		    console.log(err);
	    });
	});
       }
       else
       {
	let postData = {
	 "SortColumn": selectedValue,
	 "SortDirection": "Descending",
	 "regionID": selectedFilterValue
	}
	
	this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
       
	   this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring', postData, requestOptions)
	    .map(res => res.json())
	    .subscribe(data =>{
		    this.data = data;
		    console.log(data);
		    this.hideLoader();
	    },err => {
		    console.log(err);
	    });
	});
	
       }
       
       
       
       
       /*
       this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
       
	 this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/SortMetricAlertMonitoring', postData, requestOptions)
	  .map(res => res.json())
	  .subscribe(data =>{
		  this.data = data;
		  console.log(data);
                  this.hideLoader();
	  },err => {
		  console.log(err);
	  });
      });
      */
      
    }
   
   });
   
  }
  
  //new code logic end
  
  
  home(){
  
   //code start=> remove selected building value from storage
   /*
   this.storage.get('BuildingFilterValue').then((valBuildingFilter) => {
    if(valBuildingFilter)
    {
     this.storage.set(this.keyBuildingFilter,'');
    }
   });
   */
  
   this.navCtrl.push(DashboardPage);
  }
  
  back(){
   
   //code start=> remove selected building value from storage
   /*
   this.storage.get('BuildingFilterValue').then((valBuildingFilter) => {
    if(valBuildingFilter)
    {
     this.storage.set(this.keyBuildingFilter,'');
    }
   });
   */
   
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
  
  //code start=> remove selected building value from storage
  /*  
   this.storage.get('BuildingFilterValue').then((valBuildingFilter) => {
    if(valBuildingFilter)
    {
     this.storage.set(this.keyBuildingFilter,'');
    }
   });
   
   */
  
  
  this.storage.set(this.keyDomainID,DomainID+'**__**'+StoreID+'**__**'+DepartmentID);
  this.storage.set(this.keyAllapiDetails,DomainName+'**__**'+StoreName+'**__**'+DepartmentName+'**__**'+Description);
  
  
  //this.storage.set(this.keyStoreID,StoreID);
  //this.storage.set(this.keyDepartmentID,DepartmentID);
  
   this.storage.get('scanType').then((val99) => {
   
    if(val99=='notag')
    {
     this.navCtrl.push(ManualArrivalConfirmationPage);
    }
    else
    {
     if(val99=='qr')
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
     else
     {
      //this.navCtrl.push(ManualArrivalConfirmationPage);
      //code for NFC Tags
      
      this.storage.get('alertScanQrSettings').then((val) => {
        //check wheather QRScan settings is on or off
        if(val==true)
        {
         //alert('on');
        }
        else
        {     
         //alert('off');
         this.navCtrl.push(ManualArrivalConfirmationPage);
        }    
       });
      
      
     }
     
    }  
   });
   
  }

}
