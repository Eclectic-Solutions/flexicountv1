import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

//import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { TimerPage } from '../timer/timer';
import { TimerSignoffPage } from '../timer-signoff/timer-signoff';
import { AlertPage } from '../alert/alert';

/**
 * Generated class for the ArrivalConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-arrival-confirmation',
  templateUrl: 'arrival-confirmation.html',
})
export class ArrivalConfirmationPage {

  data={};
  option:BarcodeScannerOptions;
  public aDevice = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public barcodeScaner: BarcodeScanner, public platform: Platform, private storage: Storage, private alertController:AlertController, private http: Http) {
  }

  ionViewDidLoad() {
   
    console.log('ionViewDidLoad ArrivalConfirmationPage');
    if (!this.platform.is('cordova')) {
      this.aDevice = 1;
    }
  }
  
  scan2Code(){
  
   this.option={
    prompt: "Focus the QR code in the window below to sign off cleaning"
   }
   
   this.barcodeScaner.scan(this.option).then(barcodeData => {
   
    console.log(barcodeData);
    this.data = barcodeData;
    
    //code to check scan type
    
    this.storage.get('scanType').then((vall7) => {
     if(vall7=='qr')
     {
       //write => pending code check scaned location data with local storage data
       
       /*
       let addTodoAlert=this.alertController.create({                       
        title: "QR Scanned Data",
        message: barcodeData.text,
        buttons:[
         {
          text:"OK",           
         }
        ]     
      });
      addTodoAlert.present();
      */
      
      let scanned_qr_data =  barcodeData.text;
      let all_values_qr_data = scanned_qr_data.split(",");      
      
      let scanned_departmentID = all_values_qr_data[all_values_qr_data.length-1];
      let scanned_storeID = all_values_qr_data[all_values_qr_data.length-2];
      let scanned_domainID = all_values_qr_data[all_values_qr_data.length-3];
      
      scanned_departmentID = scanned_departmentID.trim();
      scanned_storeID = scanned_storeID.trim();
      scanned_domainID = scanned_domainID.trim();
      
      this.storage.get('loginuserDomainID').then((valloginuserDomainID) => {
       
       let values = valloginuserDomainID.split("**__**");
       let curDomainID = values[0];
       let curStoreID = values[1];
       let curDepartmentID = values[2];
       
       let flg = 0;
       
       if(scanned_departmentID!=curDepartmentID || scanned_storeID!=scanned_storeID || scanned_domainID!=curDomainID)
       {
        flg = 1;
       }
       else
       {
        flg = 0;
       }
       
       if(flg==1)
       {        
          let addTodoAlert=this.alertController.create({                       
          title: "QR Scanned Data",
          message: "Location not found, please access manually via the alert page",
          buttons:[
           {
            text:"OK",
            handler: () => {
             //redirect to alert page
             this.navCtrl.push(AlertPage);
            }
           }
          ]     
        });     
        
        addTodoAlert.present();
       }
       else
       {
        this.storage.get('alertTimerSettings').then((val7) => {
    
         if(val7==true)
         {
          //write => pending code to check scaned data with local storage data and redirect to the timer page
          
          this.navCtrl.push(TimerPage);
          
         }
         else
         {
          //call start cleaning api
          
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
       
      });       
     }
    });
   
   }).catch(err => {
   
    console.log('Error', err);
    
    /*
    let addTodoAlert=this.alertController.create({
                       
       title: "QR Scan Error",
       message: "error: "+err,
       buttons:[
         {
           text:"OK",           
         }
       ]
     
     });
     
     addTodoAlert.present();
     */
    
   });
  
  }
   
   gotoTimerPage(){
    //this.navCtrl.push(TimerPage);
    
    this.storage.get('alertTimerSettings').then((val7) => {
     
       if(val7==true)
       {
        //redirect to the next page ie Timer Page
        this.navCtrl.push(TimerPage);
       }
       else
       {
         //call start cleaning api
         
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
  
  

}
