import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

//import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';


import { DashboardPage } from '../dashboard/dashboard';
import { TimerPage } from '../timer/timer';
import { CompletionSummaryPage } from '../completion-summary/completion-summary';
import { ManualArrivalConfirmationPage } from '../manual-arrival-confirmation/manual-arrival-confirmation';
import { ArrivalConfirmationPage } from '../arrival-confirmation/arrival-confirmation';
import { AlertPage } from '../alert/alert';



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

 //for barcode

  data={};
  option:BarcodeScannerOptions;
  public aDevice = 0;
  
 //for barcode

  public timer='';
  public min=0;
  public seconds = 0;
  
  

  public LoginUserapiDetails='';
  keytimervalue:string = 'loginUserTimerValue';
  keynfcclean:string = 'startNfcClean';
  
  classVariable11: string = 'cls-disp-block';
  classVariable12: string = 'cls-disp-none';
  classVariable13: string = 'cls-disp-none';
  
  classVariableBackAll: string = 'cls-disp-block';
  classVariableBackNfc: string = 'cls-disp-none';

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private storage: Storage, public barcodeScaner: BarcodeScanner, private alertController:AlertController) {
  
   this.startTimer();
   
   
   //code start to display/hide section on Scan type
   
   this.storage.get('scanType').then((vall7) => {
      console.log(vall7);
      if(vall7=='nfc')
      {      
       this.storage.get('alertScanQrSettingsSignoff').then((val) => {
        //check wheather QRScan settings is on or off
        if(val==true)
        {
         this.classVariable11 = 'cls-disp-none';
         this.classVariable12 = 'cls-disp-none';
         this.classVariable13 = 'cls-disp-block';
        }
        else
        {     
         this.classVariable11 = 'cls-disp-block';
         this.classVariable12 = 'cls-disp-none';
         this.classVariable13 = 'cls-disp-none';  
        }    
       });
       
       this.classVariableBackNfc = 'cls-disp-bck-block';
       this.classVariableBackAll = 'cls-disp-bck-none';
       
      }
      else if(vall7=='qr')
      {
       this.storage.get('alertScanQrSettingsSignoff').then((val) => {
        //check wheather QRScan settings is on or off
        if(val==true)
        {
         this.classVariable11 = 'cls-disp-none';
         this.classVariable12 = 'cls-disp-block';
         this.classVariable13 = 'cls-disp-none';
        }
        else
        {     
         this.classVariable11 = 'cls-disp-block';
         this.classVariable12 = 'cls-disp-none';
         this.classVariable13 = 'cls-disp-none';  
        }    
       });
       
       this.classVariableBackNfc = 'cls-disp-bck-none';
       this.classVariableBackAll = 'cls-disp-bck-block';
       
      }
      else
      {
       this.classVariable11 = 'cls-disp-block';
       this.classVariable12 = 'cls-disp-none';
       this.classVariable13 = 'cls-disp-none';
       
       this.classVariableBackNfc = 'cls-disp-bck-none';
       this.classVariableBackAll = 'cls-disp-bck-block';
      }
    });
   
   //code end to display/hide section on Scan type
   
  }
  
  //timer js code start
  
  startTimer(){
  
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
  }
  
  //timer js code end

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimerSignoffPage');
    //this.loadSelectedLocation();
    
    this.checkNFCStart();
  }
  
  checkNFCStart(){
   this.storage.get('startNfcClean').then((valClean) => {
    if(valClean==true)
    {
     //section for NFC Start cleaning api call
     
     //start cleaning api call - start
     
     this.storage.get('loginuserDomainID').then((valloginuserDomainID) => {
      
      let values = valloginuserDomainID.split("**__**");
      let curDomainID = values[0];
      let curStoreID = values[1];
      let curDepartmentID = values[2];
      
      this.storage.get('loginUserToken').then((valloginUserToken) => {
      
        //code to call start cleaning api                                                    
        var headers = new Headers();
        headers.append("Authorization", 'Bearer '+valloginUserToken);       
        const requestOptions = new RequestOptions({ headers: headers });
      
        let postData = {
          "DomainID": curDomainID,
          "StoreID": curStoreID,
          "DepartmentID": curDepartmentID
        }
      
        //api call start
        this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {                                      
            this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertStartedCleaning',postData,requestOptions)
            .map(res => res.json())
            .subscribe(data =>{
             
             console.log('Get NFC Start Cleaning response');
             this.loadSelectedLocation();
             
            },err => {
              console.log(err);
            });                                                    
          });
        //api call start
      });
      
     });
     
     //start cleaning api call - end
     
    }
    else
    {
     console.log('Non-NFC Section');
     this.loadSelectedLocation();
    }
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
    
   this.navCtrl.push(CompletionSummaryPage);
  }
  
  
  
  scan2Code(){
  
   this.option={
    prompt: "Focus the QR code in the window below to sign off cleaning"
   }
   
   this.barcodeScaner.scan(this.option).then(barcodeData => {
   
    console.log(barcodeData);
    this.data = barcodeData;
    
    
    //code to check selected scan type
    this.storage.get('scanType').then((valstype) => {
     if(valstype=='qr')
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
        //write => pending code check scaned location data with local storage data
         
         //code to check sign off settings
         this.storage.get('alertScanQrSettingsSignoff').then((valScanActive) => {
          if(valScanActive==true)
          {
           //write => pending code start to check location details and redirect to the completion summart page
            
            this.storage.set(this.keytimervalue,'');
            this.navCtrl.push(CompletionSummaryPage);
            
           //code end to check location details and redirect to the completion summart page
          }
          else
          {
           this.storage.set(this.keytimervalue,'');
           this.navCtrl.push(CompletionSummaryPage); 
          }
         });
       }
       
      });
      
     }
     else
     {
      this.storage.set(this.keytimervalue,'');
      this.navCtrl.push(CompletionSummaryPage);
     }
    });
   
   }).catch(err => {   
    console.log('Error', err);
   });
  
  }
  

}
