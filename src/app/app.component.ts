import { Component, ViewChild } from '@angular/core';
import { Platform, AlertController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BackgroundMode } from '@ionic-native/background-mode';


import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { NativeAudio } from '@ionic-native/native-audio';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { NFC, Ndef } from '@ionic-native/nfc';



import { HomePage } from '../pages/home/home';
import { AlertPage } from '../pages/alert/alert';

import { TimerPage } from '../pages/timer/timer';
import { TimerSignoffPage } from '../pages/timer-signoff/timer-signoff';
import { CompletionSummaryPage } from '../pages/completion-summary/completion-summary';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = HomePage;
  keydeviceToken:string = 'deviceToken';
  keyconfirmsiteurl:string = 'loginUserConfirmSiteURL';
  
  keynfcclean:string = 'startNfcClean';
  
  keyDomainID:string = 'loginuserDomainID';
  keyAllapiDetails:string = 'loginuserApiDetails';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private push: Push, private alertCtrl:AlertController, private http: Http, private storage: Storage, private nativeAudio: NativeAudio, private backgroundMode: BackgroundMode, private localNotifications: LocalNotifications, private nfc: NFC, private ndef: Ndef) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      
      
      statusBar.styleDefault();
      if(platform.is('android'))
      {
        statusBar.overlaysWebView(false);
        statusBar.backgroundColorByHexString('#000000');
      }
      
      
      splashScreen.hide();
      
      //code start for native audio
      
      this.nativeAudio.preloadSimple('uniqueId1', 'assets/ding.mp3').then((success)=>{
        console.log("success");
      },(error)=>{
        console.log(error);
      });
      
      //code end for native audio
      
      
      
      this.backgroundMode.enable();
      
      this.initPushNotification();
      
      
      //code start to trigger local notification on every 1min for ios device
      
      if(platform.is('ios'))
      {
        let timerId;
        
        //this function called when app goes to background mode
        
        this.backgroundMode.on('activate').subscribe(() => {
          console.log('activated');
          
          timerId = setInterval(function(){
          
            //code to trigger local notification
            
            this.localNotifications.schedule({
              id: 1,
              text: 'App is running in background'
            });
            
          }, 60000);
          
          
        });
        
        //this function called when app comes to foreground mode from background mode
        
        this.backgroundMode.on('deactivate').subscribe(() => {
          console.log('deactivated');          
          clearInterval(timerId);
        });
      }
      
      //this code activate runs when app goes to background mode
      
      
      
      
      //code end to trigger local notification on every 1min for ios device
      
      
      //code start for NFC
      
      var isAppInForeground = true;
      
      document.addEventListener("pause", function pauseCallback() {
        isAppInForeground = false;
      }, false);

      document.addEventListener("resume", function resumeCallback() {
        isAppInForeground = true;
      }, false);
      
      console.log('d:'+isAppInForeground);

      
      if(platform.is('ios'))
      {
      
        this.nfc.beginSession().subscribe(res => {
        
          this.nfc.addNdefListener(() => {
            console.log('successfully attached ndef listener');
          }, (err) => {
            console.log('error attaching ndef listener', err);
          }).subscribe((event) => {
            console.log('received ndef message. the tag contains: ', event.tag);
            console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));
            
            
            let nfc_data77 = event.tag.toString();
            let nfc_data7 = this.nfc.bytesToHexString(event.tag.id);
            
            const alert1 = this.alertCtrl.create({
              title: 'Event Tag',
              message: nfc_data77,
              buttons: ['OK']
            });
            alert1.present();
            
            const alert2 = this.alertCtrl.create({
              title: 'Tag ID',
              message: nfc_data7,
              buttons: ['OK']
            });
            alert2.present();
            
            
            //write => pending code/waiting for testing to check location is redable or not
            
            let scanned_NfcdepartmentID='';
            let scanned_NfcstoreID='';
            let scanned_NfcdomainID='';
            
            if(event.tag.id)
            {
              //code to get domain, store & department id
              
              //let scanned_nfc_data = event.tag.id.toString();
              //let scanned_nfc_data = this.nfc.bytesToHexString(event.tag.id);
              
              let payload = event.tag.ndefMessage[0].payload;
              let scanned_nfc_data = this.nfc.bytesToString(payload);
              let all_values_nfc_data = scanned_nfc_data.split(",");
              
              scanned_NfcdepartmentID = all_values_nfc_data[all_values_nfc_data.length-1];
              scanned_NfcstoreID = all_values_nfc_data[all_values_nfc_data.length-2];
              scanned_NfcdomainID = all_values_nfc_data[all_values_nfc_data.length-3];
              
              scanned_NfcdepartmentID = scanned_NfcdepartmentID.trim();
              scanned_NfcstoreID = scanned_NfcstoreID.trim();
              scanned_NfcdomainID = scanned_NfcdomainID.trim();
            }
            else
            {
              //pending code - write an alert code
              const alert = this.alertCtrl.create({
                title: 'NFC Tag Scan',
                message: 'No tag id found',
                buttons: ['OK']
              });
              alert.present();
            }
            
            //code started to check cleaning started or not
            
            this.storage.get('startNfcClean').then((valClean) => {
          
              if(valClean==true)
              {
                //section for complete cleaning
                this.storage.get('scanType').then((valstype) => {
                  if(valstype=='nfc')
                  {
                    this.storage.get('alertScanQrSettingsSignoff').then((valScanActive) => {
                      if(valScanActive==true)
                      {
                        this.storage.get('loginUserToken').then((valloginUserToken) => {
                          if(valloginUserToken)
                          {
                            //have to call complete cleaning api and redirect to the comp summary page
                            
                            this.nav.push(CompletionSummaryPage);
                          }
                          else
                          {
                            this.nav.push(HomePage);
                          }
                        });
                      }
                    });
                  }
                });
              }
              else
              {
                //section for start cleaning
                
                //code to check scan type is NFC or not
                
                this.storage.get('scanType').then((valstype) => {
                  if(valstype=='nfc')
                  {
                    //code to check sign in is active or not
                    this.storage.get('alertScanQrSettings').then((valScanActive) => {
                      
                      if(valScanActive==true)
                      {
                        //code to save all storage values including domain, store and department
                        this.storage.set(this.keynfcclean,true);
                        
                        //write => pending code/waiting for testing to set data
                        
                        let nfcScannedDomainName='';
                        let nfcScannedDomainDescription='';
                        let nfcScannedStoreName='';
                        let nfcScannedDepartName='';
                        
                        //code - api to call and get domain, store and depart name
                        
                        this.storage.get('loginUserToken').then((valloginUserToken) => {   
                          if(valloginUserToken!='')
                          {
                            var headers = new Headers();
                            headers.append("Authorization", 'Bearer '+valloginUserToken);       
                            const requestOptions = new RequestOptions({ headers: headers });
                            
                            this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
                              
                              this.http.get('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/GetMetricAlertMonitoringByID?DomainID=2&StoreID=3&DepartmentID=1', requestOptions)
                                .map(res => res.json())
                                .subscribe(data =>{
                                  console.log('get store details');
                                  
                                  nfcScannedDomainName=data.Domain.Name;
                                  nfcScannedDomainDescription=data.Domain.Description;
                                  nfcScannedStoreName=data.Store.Name;
                                  nfcScannedDepartName=data.Department.Name;
                                  //console.log(data.Store.Name);
                                  //console.log(data.Department.Name);
                                },err => {
                                  console.log(err);
                                });
                            });
                            
                          }
                         
                        });
                        
                        //this.storage.set(this.keyDomainID,'2'+'**__**'+'3'+'**__**'+'1');
                        //this.storage.set(this.keyAllapiDetails,'Building 1'+'**__**'+'Floor 1'+'**__**'+'Unisex 1'+'**__**'+'B1');
                        
                        this.storage.set(this.keyDomainID,scanned_NfcdomainID+'**__**'+scanned_NfcstoreID+'**__**'+scanned_NfcdepartmentID);
                        this.storage.set(this.keyAllapiDetails,nfcScannedDomainName+'**__**'+nfcScannedStoreName+'**__**'+nfcScannedDepartName+'**__**'+nfcScannedDomainDescription);
                        
                        //code to check for login
                        this.storage.get('loginUserToken').then((valloginUserToken) => {
                  
                          if(valloginUserToken)
                          {
                            //check if app in background mode
                            if(isAppInForeground==false)
                            {
                              //code to send local notification
                              
                              this.localNotifications.schedule({
                                id: 88,
                                text: 'You have scanned NFC Tag for location:'
                              });
                              
                              this.localNotifications.on('click').subscribe(notification => {
                                
                                if(notification.id==88)
                                {                         
                                  const alert = this.alertCtrl.create({            
                                    title: 'Notification',
                                    message: 'You have scanned NFC Tag',                  
                                    buttons: [
                                      {
                                        text: 'OK',
                                        role: 'ok',
                                        handler: () => {
                                          
                                          //code to check timer settings and call start cleaning api
                                          this.storage.get('alertTimerSettings').then((val1) => {    
                                            if(val1==true)
                                            {
                                              //redirect to the next page ie Timer Page if Timer settings is ON
                                              this.nav.push(TimerPage);
                                            }
                                            else
                                            {
                                              this.storage.get('loginuserDomainID').then((valloginuserDomainID) => {
                                                
                                                //write => pending code/waiting for testing to call start cleaning api
                                                
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
                                                      //this.data = data;
                                                      console.log(data);
                                                    },err => {
                                                      console.log(err);
                                                    });            
                                                  });
                                                });
                                                
                                              });        
                                              
                                              //redirect to the next page of the Timer Page ie Timer Page
                                              this.nav.push(TimerSignoffPage);
                                            }                          
                                          });
                                          
                                        },                
                                      }              
                                    ]          
                                  });        
                                  alert.present();
                                }
                                
                              });
                              
                            }
                            else
                            {
                              //-------------when app is on foreground ------------------------
                              //code to check timer settings and call start cleaning api
                              this.storage.get('alertTimerSettings').then((val1) => {    
                                if(val1==true)
                                {
                                  //redirect to the next page ie Timer Page
                                  this.nav.push(TimerPage);
                                }
                                else
                                {
                                  this.storage.get('loginuserDomainID').then((valloginuserDomainID) => {
                                    
                                  // write => pending/waiting for test to call start cleaning api
                                  
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
                                          //this.data = data;
                                          console.log(data);
                                        },err => {
                                          console.log(err);
                                        });            
                                      });
                                    });
                                  
                                    
                                  });        
                                  
                                  //redirect to the next page of the Timer Page ie Timer Page
                                  this.nav.push(TimerSignoffPage);
                                }                          
                              });
                            }
                          }
                          else
                          {
                            this.nav.push(HomePage);
                          }                        
                        });
                      }
                      else
                      {
                        //redirect to the alert page
                        this.nav.push(AlertPage);
                      }
                    });                  
                  }
                });
              }          
            });
            
            
          });
        },
        err => {
          console.log(err);
        });            
      }
      if(platform.is('android'))
      {  
        this.nfc.addNdefListener(() => {
        
          console.log('successfully attached ndef listener');
          
        }, (err) => {
        
          console.log('error attaching ndef listener', err);
          
        }).subscribe((event) => {
        
          console.log('received ndef message. the tag contains: ', event.tag);
          console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));
          
          
          //write => pending code/waiting for testing to check location is redable or not
          
          let scanned_NfcdepartmentID='';
          let scanned_NfcstoreID='';
          let scanned_NfcdomainID='';
          
          if(event.tag.id)
          {
            let payload = event.tag.ndefMessage[0].payload;
            let scanned_nfc_data = this.nfc.bytesToString(payload);
            let all_values_nfc_data = scanned_nfc_data.split(",");
            
            scanned_NfcdepartmentID = all_values_nfc_data[all_values_nfc_data.length-1];
            scanned_NfcstoreID = all_values_nfc_data[all_values_nfc_data.length-2];
            scanned_NfcdomainID = all_values_nfc_data[all_values_nfc_data.length-3];
            
            scanned_NfcdepartmentID = scanned_NfcdepartmentID.trim();
            scanned_NfcstoreID = scanned_NfcstoreID.trim();
            scanned_NfcdomainID = scanned_NfcdomainID.trim();
          }
          else
          {
            //pending code - write an alert code
            const alert = this.alertCtrl.create({
              title: 'NFC Tag Scan',
              message: 'No tag id found',
              buttons: ['OK']
            });
            alert.present();
          }
    
          
          //code start to check cleaning started for NFC or not
          
          this.storage.get('startNfcClean').then((valClean) => {
          
            if(valClean==true)
            {
              //section for complete cleaning
              this.storage.get('scanType').then((valstype) => {
                if(valstype=='nfc')
                {
                  this.storage.get('alertScanQrSettingsSignoff').then((valScanActive) => {
                    if(valScanActive==true)
                    {
                      this.storage.get('loginUserToken').then((valloginUserToken) => {
                        if(valloginUserToken)
                        {
                          //have to call complete cleaning api and redirect to the comp summary page
                          
                          this.nav.push(CompletionSummaryPage);
                        }
                        else
                        {
                          this.nav.push(HomePage);
                        }
                      });
                    }
                  });
                }
              });
            }
            else
            {
              //section for start cleaning
              
              //code to check scan type is NFC or not
              
              this.storage.get('scanType').then((valstype) => {
                if(valstype=='nfc')
                {
                  //code to check sign in is active or not
                  this.storage.get('alertScanQrSettings').then((valScanActive) => {
                    
                    if(valScanActive==true)
                    {
                      //write => pending code to save all storage values including domain, store and department
                      this.storage.set(this.keynfcclean,true);
                      
                      //write => pending code/waiting for testing to set data
                      
                      let nfcScannedDomainName='';
                      let nfcScannedDomainDescription='';
                      let nfcScannedStoreName='';
                      let nfcScannedDepartName='';
                      
                      //code - api to call and get domain, store and depart name
                      
                      this.storage.get('loginUserToken').then((valloginUserToken) => {   
                        if(valloginUserToken!='')
                        {
                          var headers = new Headers();
                          headers.append("Authorization", 'Bearer '+valloginUserToken);       
                          const requestOptions = new RequestOptions({ headers: headers });
                          
                          this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
                            
                            this.http.get('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/GetMetricAlertMonitoringByID?DomainID=2&StoreID=3&DepartmentID=1', requestOptions)
                              .map(res => res.json())
                              .subscribe(data =>{
                                console.log('get store details');
                                
                                nfcScannedDomainName=data.Domain.Name;
                                nfcScannedDomainDescription=data.Domain.Description;
                                nfcScannedStoreName=data.Store.Name;
                                nfcScannedDepartName=data.Department.Name;
                                //console.log(data.Store.Name);
                                //console.log(data.Department.Name);
                              },err => {
                                console.log(err);
                              });
                          });
                          
                        }                         
                    });
                      
                      
                    //this.storage.set(this.keyDomainID,'2'+'**__**'+'3'+'**__**'+'1');
                    //this.storage.set(this.keyAllapiDetails,'Building 1'+'**__**'+'Floor 1'+'**__**'+'Unisex 1'+'**__**'+'B1');
                    
                    this.storage.set(this.keyDomainID,scanned_NfcdomainID+'**__**'+scanned_NfcstoreID+'**__**'+scanned_NfcdepartmentID);
                    this.storage.set(this.keyAllapiDetails,nfcScannedDomainName+'**__**'+nfcScannedStoreName+'**__**'+nfcScannedDepartName+'**__**'+nfcScannedDomainDescription);
                      
                      
                      //code to check for login
                      this.storage.get('loginUserToken').then((valloginUserToken) => {
                
                        if(valloginUserToken)
                        {
                          //check if app in background mode
                          if(isAppInForeground==false)
                          {
                            //code to send local notification
                            
                            this.localNotifications.schedule({
                              id: 77,
                              text: 'You have scanned NFC Tag for location:'
                            });
                            
                            this.localNotifications.on('click').subscribe(notification => {
                              
                              if(notification.id==77)
                              {                         
                                const alert = this.alertCtrl.create({            
                                  title: 'Notification',
                                  message: 'You have scanned NFC Tag',                  
                                  buttons: [
                                    {
                                      text: 'OK',
                                      role: 'ok',
                                      handler: () => {
                                        
                                        //code to check timer settings and call start cleaning api
                                        this.storage.get('alertTimerSettings').then((val1) => {    
                                          if(val1==true)
                                          {
                                            //redirect to the next page ie Timer Page
                                            this.nav.push(TimerPage);
                                          }
                                          else
                                          {
                                            this.storage.get('loginuserDomainID').then((valloginuserDomainID) => {
                                              
                                            //write=> pending code have to call start cleaning api
                                            
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
                                                    //this.data = data;
                                                    console.log(data);
                                                  },err => {
                                                    console.log(err);
                                                  });            
                                                });
                                              });
                                            
                                              
                                            });        
                                            
                                            //redirect to the next page of the Timer Page ie Timer Page
                                            this.nav.push(TimerSignoffPage);
                                          }                          
                                        });
                                        
                                      },                
                                    }              
                                  ]          
                                });        
                                alert.present();
                              }
                              
                            });
                            
                          }
                          else
                          {
                            //-------------when app is on foreground ------------------------
                            //code to check timer settings and call start cleaning api
                            this.storage.get('alertTimerSettings').then((val1) => {    
                              if(val1==true)
                              {
                                //redirect to the next page ie Timer Page
                                this.nav.push(TimerPage);
                              }
                              else
                              {
                                this.storage.get('loginuserDomainID').then((valloginuserDomainID) => {
                                  
                                  // write => pending/waiting for test to call start cleaning api
                                
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
                                        //this.data = data;
                                        console.log(data);
                                      },err => {
                                        console.log(err);
                                      });            
                                    });
                                  });
                                  
                                });        
                                
                                //redirect to the next page of the Timer Page ie Timer Page
                                this.nav.push(TimerSignoffPage);
                              }                          
                            });
                          }
                        }
                        else
                        {
                          this.nav.push(HomePage);
                        }                        
                      });
                    }                    
                  });                  
                }
              });
            }          
          });
        });
      }
      
      //code end for NFC
      
    });    
  }
  
  
  //code start to play native audio
  
  play(){
    this.nativeAudio.play('uniqueId1').then((success)=>{
      console.log("success playing");
    },(error)=>{
      console.log(error);
    });
  }
  
  //code end to play native audio
  
  
  initPushNotification(){
    
    //check push notification permisson
    
    if (window.hasOwnProperty("cordova")) {
      this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do NOT have permission to send push notifications');
          
          /*
          const alert = this.alertCtrl.create({
            title: 'Notification Alert',
            message: 'We do not have permission to send notification. Please enable notification.',
            buttons: ['OK']
          });        
          alert.present();
          */
        }
      });
    }
  
  
    const options: PushOptions = {
        android: {
          senderID: '112807975750'          
        },
        ios: {
            alert: 'true',
            badge: 'true',
            sound: 'true'
        }
    };

    const pushObject: PushObject = this.push.init(options);
    
    pushObject.on('registration').subscribe((data: any) => {
    
      console.log('device token -> ' + data.registrationId);
      
      //clear local siteurl storage data from 
      
      this.storage.set(this.keyconfirmsiteurl,'');
      
      /*
      const alert = this.alertCtrl.create({
        title: 'Device Token',
        message: data.registrationId,
        buttons: ['OK']
      });        
      
      */
      
      //code start: store device token in BAS
      
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      const requestOptions = new RequestOptions({ headers: headers });
      
      let postData = {
	"deviceToken": data.registrationId
      }
      
      this.http.post("https://auth.biblicalarchaeology.org/pushnotification.php", postData, requestOptions)      
      .subscribe(datalogin =>{
	  console.log(datalogin);
      }, error => {
        console.log(error);	
	
      });
      
      //code end: store device token in BAS
      
      
      
      this.storage.set(this.keydeviceToken,data.registrationId);      
      
    });
    
    pushObject.on('notification').subscribe((data: any) => {    
      
      //start code to call MetricAlertMonitoringDeliver api
      
      this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
      
        if(valLoginUserConfirmSiteURL)
        {
          this.storage.get('loginUserToken').then((valloginUserToken) => {
          
            if(valloginUserToken!='')
            {
              //code start: condition start to call api not for
              if(!(data.additionalData.Action=="completed_cleaning" || data.additionalData.Action=="started_cleaning"))
              {
                var headers = new Headers();
                headers.append("Authorization", 'Bearer '+valloginUserToken);       
                const requestOptions = new RequestOptions({ headers: headers });
                
                let postData = {
                  "DomainID": data.additionalData.DomainID,
                  "StoreID": data.additionalData.StoreID,
                  "DepartmentID": data.additionalData.DepartmentID
                }
                
                this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertMonitoringDeliver',postData,requestOptions)
                .map(res => res.json())
                .subscribe(data1 =>{
                 
                },err => {
                  const alert = this.alertCtrl.create({
                    title: 'Deliver API Error',
                    message: 'err=> '+err,
                    buttons: ['OK']
                  });
                  alert.present();                
                });
              }
              //code end: condition end to call api not for
            }
            
          });
        }
        
      });
      
      //end code to call MetricAlertMonitoringDeliver api      
      
      console.log('message -> ' + data.message);      
      if(data.additionalData.foreground)
      {
        //code start to play custom notification sound        
        this.play();        
        //code end to play custom notification sound
                
        let view = this.nav.getActive();
        //alert(view.component.name);
        
        
        //condition to check action is not completed_cleaning and started_cleaning then call api
        if(!(data.additionalData.Action=="completed_cleaning" || data.additionalData.Action=="started_cleaning"))
        {
          const alert = this.alertCtrl.create({
            
            title: 'Notification',
            mode:'ios',
            message: data.message,
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'Accept',
                role: 'accept',
                handler: () => {
                  //code when user click on the accept option
                  
                  //code to check wheather sitelogin url is stored or not
                  this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
                    if(valLoginUserConfirmSiteURL)
                    {
                      //code to check user is logged in or not
                      this.storage.get('loginUserToken').then((valloginUserToken) => {
                        if(valloginUserToken!='')
                        {
                          //code start to check wheather alert ack settings is on
                          this.storage.get('alertAlertAcknowledgedSettings').then((alertAckVal) =>{                        
                            if(alertAckVal==true)
                            {
                              //code to call MetricAlertMonitoringAcknowledge API
                              var headers = new Headers();
                              headers.append("Authorization", 'Bearer '+valloginUserToken);       
                              const requestOptions = new RequestOptions({ headers: headers });
                              
                              let postData = {
                                "DomainID": data.additionalData.DomainID,
                                "StoreID": data.additionalData.StoreID,
                                "DepartmentID": data.additionalData.DepartmentID,
                                "MetricAlertMonitoringsStatusID": 1
                              }
                              
                              //code to call api
                              this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertMonitoringAcknowledge',postData,requestOptions)
                              .map(res => res.json())
                              .subscribe(data1 =>{                                
                                
                                  //code start to check if notification status is already accepted or not                              
                                  if(data1.AlreadyAccepted==true)
                                  {
                                    //code to show another alert for already accepted
                                    const alert = this.alertCtrl.create({
                                      title: 'Notification',
                                      message: 'This notification has already been accepted. No further action required.',
                                      buttons:[
                                       {
                                        text:"OK",
                                        handler:()=>
                                        {
                                          if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
                                          {
                                            this.nav.push(AlertPage);
                                          }
                                        }
                                       }
                                      ]
                                     
                                     });
                                    alert.present();
                                  }
                                  else
                                  {
                                    if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
                                    {
                                      this.nav.push(AlertPage);
                                    }
                                  }
                                  
                                  //code end to check if notification status is already accepted or not
                                },err => {
                                  const alert = this.alertCtrl.create({
                                  title: 'ACK API Error',
                                  message: 'err=> '+err,
                                  buttons: ['OK']
                                });
                                alert.present();
                              });
                              
                              //code start to check if notification status is already accepted or not
                              
                              //code end to check if notification status is already accepted or not
                            }                        
                          });
                        }
                        else
                        {
                          this.nav.push(HomePage);
                        }
                      });
                    }
                    else
                    {
                      this.nav.push(HomePage);
                    }
                  });
                },
                cssClass: 'esol_green'
              },
              {
                text: 'Reject',
                role: 'reject',
                handler: () => {
                  //code when user click on the Reject option
                  
                  //code to check wheather sitelogin url is stored or not
                  this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
                    if(valLoginUserConfirmSiteURL)
                    {
                      //code to check user is logged in or not
                      this.storage.get('loginUserToken').then((valloginUserToken) => {
                        if(valloginUserToken!='')
                        {
                          this.storage.get('alertAlertAcknowledgedSettings').then((alertAckVal) =>{
                            if(alertAckVal==true)
                            {
                              //code to call MetricAlertMonitoringAcknowledge API
                              var headers = new Headers();
                              headers.append("Authorization", 'Bearer '+valloginUserToken);       
                              const requestOptions = new RequestOptions({ headers: headers });
                              
                              let postData = {
                                "DomainID": data.additionalData.DomainID,
                                "StoreID": data.additionalData.StoreID,
                                "DepartmentID": data.additionalData.DepartmentID,
                                "MetricAlertMonitoringsStatusID": 2
                              }
                              
                              this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertMonitoringAcknowledge',postData,requestOptions)
                              .map(res => res.json())
                              .subscribe(data1 =>{                            
                              },err => {
                                  const alert = this.alertCtrl.create({
                                    title: 'ACK API Error',
                                    message: 'err=> '+err,
                                    buttons: ['OK']
                                  });
                                  alert.present();
                              });
                              
                              if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
                              {
                                this.nav.push(AlertPage);
                              }
                            }
                            else
                            {
                              if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
                              {
                                this.nav.push(AlertPage);
                              }
                            }
                          });
                        }
                        else
                        {
                          this.nav.push(HomePage);
                        }
                      });
                    }
                    else
                    {
                      this.nav.push(HomePage);
                    }
                  });
                  
                },
                cssClass: 'esol_red'
              }
            ]
          
          });        
          alert.present();
        }
        else
        {
          //code to other conditions
          
          const alert = this.alertCtrl.create({
            title: 'Notification',
            message: data.message,
            enableBackdropDismiss: false,
            buttons:[
            {
              text:"OK",
              handler:()=>
              {
                //code to check wheather sitelogin url is stored or not
                this.storage.get('loginUserToken').then((valloginUserToken) => {
                  if(valloginUserToken!='')
                  {
                    //if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
                    if(view.component.name!='TimerPage' && view.component.name!='CompletionSummaryPage')
                    {
                      this.nav.push(AlertPage);
                    }
                  }
                  else
                  {
                    this.nav.push(HomePage);
                  }
                });
              }
            }
            ]          
          });        
          alert.present();
        }
        
      }//end code for foreground mode
      else
      {      
        //code for when app is in background        
        let view = this.nav.getActive();
        
        //condition to check action is not completed_cleaning and started_cleaning then call api
        if(!(data.additionalData.Action=="completed_cleaning" || data.additionalData.Action=="started_cleaning"))
        {
          const alert = this.alertCtrl.create({
            
            title: 'Notification',
            mode:'ios',
            message: data.message,
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'Accept',
                role: 'accept',
                handler: () => {
                  //code when user click on the accept option
                  
                  //code to check wheather sitelogin url is stored or not
                  this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
                    if(valLoginUserConfirmSiteURL)
                    {
                      //code to check user is logged in or not
                      this.storage.get('loginUserToken').then((valloginUserToken) => {
                        if(valloginUserToken!='')
                        {
                          //code start to check wheather alert ack settings is on
                          this.storage.get('alertAlertAcknowledgedSettings').then((alertAckVal) =>{                        
                            if(alertAckVal==true)
                            {
                              //code to call MetricAlertMonitoringAcknowledge API
                              var headers = new Headers();
                              headers.append("Authorization", 'Bearer '+valloginUserToken);       
                              const requestOptions = new RequestOptions({ headers: headers });
                              
                              let postData = {
                                "DomainID": data.additionalData.DomainID,
                                "StoreID": data.additionalData.StoreID,
                                "DepartmentID": data.additionalData.DepartmentID,
                                "MetricAlertMonitoringsStatusID": 1
                              }
                              
                              //code to call api
                              this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertMonitoringAcknowledge',postData,requestOptions)
                              .map(res => res.json())
                              .subscribe(data1 =>{
                                
                                //code start to check if notification status is already accepted or not                              
                                    if(data1.AlreadyAccepted==true)
                                    {
                                      //code to show another alert for already accepted
                                      const alert = this.alertCtrl.create({
                                        title: 'Notification',
                                        message: 'This notification has already been accepted. No further action required.',
                                        buttons:[
                                         {
                                          text:"OK",
                                          handler:()=>
                                          {
                                            if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
                                            {
                                              this.nav.push(AlertPage);
                                            }
                                          }
                                         }
                                        ]
                                       
                                       });
                                      alert.present();
                                    }
                                    else
                                    {
                                      if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
                                      {
                                        this.nav.push(AlertPage);
                                      }
                                    }
                                //code end to check if notification status is already accepted or not
                                
                                
                                },err => {
                                  const alert = this.alertCtrl.create({
                                  title: 'ACK API Error',
                                  message: 'err=> '+err,
                                  buttons: ['OK']
                                });
                                alert.present();
                              });
                              
                              //code start to check if notification status is already accepted or not                              
                              
                              //code end to check if notification status is already accepted or not                              
                            }                        
                          });
                        }
                        else
                        {
                          this.nav.push(HomePage);
                        }
                      });
                    }
                    else
                    {
                      this.nav.push(HomePage);
                    }
                  });
                },
                cssClass: 'esol_green'
              },
              {
                text: 'Reject',
                role: 'reject',
                handler: () => {
                  //code when user click on the Reject option
                  
                  //code to check wheather sitelogin url is stored or not
                  this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
                    if(valLoginUserConfirmSiteURL)
                    {
                      //code to check user is logged in or not
                      this.storage.get('loginUserToken').then((valloginUserToken) => {
                        if(valloginUserToken!='')
                        {
                          this.storage.get('alertAlertAcknowledgedSettings').then((alertAckVal) =>{
                            if(alertAckVal==true)
                            {
                              //code to call MetricAlertMonitoringAcknowledge API
                              var headers = new Headers();
                              headers.append("Authorization", 'Bearer '+valloginUserToken);       
                              const requestOptions = new RequestOptions({ headers: headers });
                              
                              let postData = {
                                "DomainID": data.additionalData.DomainID,
                                "StoreID": data.additionalData.StoreID,
                                "DepartmentID": data.additionalData.DepartmentID,
                                "MetricAlertMonitoringsStatusID": 2
                              }
                              
                              this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertMonitoringAcknowledge',postData,requestOptions)
                              .map(res => res.json())
                              .subscribe(data1 =>{                            
                              },err => {
                                  const alert = this.alertCtrl.create({
                                    title: 'ACK API Error',
                                    message: 'err=> '+err,
                                    buttons: ['OK']
                                  });
                                  alert.present();
                              });
                              
                              if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
                              {
                                this.nav.push(AlertPage);
                              }
                            }
                            else
                            {
                              if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
                              {
                                this.nav.push(AlertPage);
                              }
                            }
                          });
                        }
                        else
                        {
                          this.nav.push(HomePage);
                        }
                      });
                    }
                    else
                    {
                      this.nav.push(HomePage);
                    }
                  });
                  
                },
                cssClass: 'esol_red'
              }
            ]
          
          });        
          alert.present();
        }
        else
        {
          //code to other conditions
          
          const alert = this.alertCtrl.create({
            title: 'Notification',
            message: data.message,
            enableBackdropDismiss: false,
            buttons:[
              {
              text:"OK",
              handler:()=>
              {
                //code to check wheather sitelogin url is stored or not
                this.storage.get('loginUserToken').then((valloginUserToken) => {
                  if(valloginUserToken!='')
                  {
                    //if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
                    //if(view.component.name!='TimerPage')
                    if(view.component.name!='TimerPage' && view.component.name!='CompletionSummaryPage')
                    {
                      this.nav.push(AlertPage);
                    }                        
                  }
                  else
                  {
                    this.nav.push(HomePage);
                  }
                });                
              }
            }
            ]          
          });        
          alert.present();
        }        
      }//end code for background mode  
    });
    
    //pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
    
    pushObject.on('error').subscribe((error: any) => {
    
      console.log('Error with Push plugin -> ' + error);
      
      const alert = this.alertCtrl.create({
        title: 'Device Token',
        message: error.message,
        buttons: ['OK']
      });        
      alert.present();
      
    });
    
  
  }
  
}

