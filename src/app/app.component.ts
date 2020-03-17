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



import { HomePage } from '../pages/home/home';
import { AlertPage } from '../pages/alert/alert';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = HomePage;
  keydeviceToken:string = 'deviceToken';
  
  keyPausetimeStamp:string = 'pauseTimeStamp';
  keytimervalueBackground:string = 'loginUserTimerValueBackground';
  keytimervalue:string = 'loginUserTimerValue';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private push: Push, private alertCtrl:AlertController, private http: Http, private storage: Storage, private nativeAudio: NativeAudio, private backgroundMode: BackgroundMode) {
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
      
      platform.pause.subscribe ( (e) => {
        
        let view = this.nav.getActive();
        
        //this code only work for timer page & timer sign off page
        if(view.component.name=='TimerPage' || view.component.name=='TimerSignoffPage')
        {
          //code to get pause time stamp
          var today = new Date();
          var pausetime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          
          //code to convert resume time to seconds
          var a = pausetime.split(':');      
          var pausetimeStamp = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);         
          
          this.storage.get('loginUserToken').then((valloginUserToken) => {
            if(valloginUserToken)
            {
              this.storage.get('loginUserTimerValueBackground').then((valTimerValueBackground) => {
                if(valTimerValueBackground)
                {
                  const alert10 = this.alertCtrl.create({
                    title: 'pause time saved here',
                    message: 'pausetime=> '+pausetimeStamp,
                    buttons: ['OK']
                  });
                  alert10.present();
                
                  this.storage.set(this.keyPausetimeStamp,pausetimeStamp);
                }//end of background time check
                else
                {
                  this.storage.set(this.keyPausetimeStamp,'');
                }    
              });
            }//end of login token check
            else
            {
              this.storage.set(this.keytimervalueBackground,'');
              this.storage.set(this.keyPausetimeStamp,'');
              this.storage.set(this.keytimervalue,'');
            }    
          });          
        }//end of page check
        else
        {
          this.storage.set(this.keytimervalueBackground,'');
          this.storage.set(this.keyPausetimeStamp,'');
          this.storage.set(this.keytimervalue,'');
        }
      });
      
      platform.resume.subscribe ( (e) => {
        
        let view = this.nav.getActive();
        
        //this code only work for timer page & timer sign off page
        if(view.component.name=='TimerPage' || view.component.name=='TimerSignoffPage')
        {
          //code to get resume time stamp
          var today = new Date();
          var resumetime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          
          //code to convert resume time to seconds
          var a = resumetime.split(':');      
          var resumeTimeSeconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
          
          this.storage.get('loginUserToken').then((valloginUserToken) => {
            if(valloginUserToken)
            {
              this.storage.get('pauseTimeStamp').then((valpauseTimeStamp) => {
                if(valpauseTimeStamp)
                {
                  this.storage.get('loginUserTimerValueBackground').then((valTimerValueBackground) => {
                    if(valTimerValueBackground)
                    {
                      //code to fetch background timer value and convert it to seconds                    
                      var hms = valTimerValueBackground;
                      var a = hms.split(':');      
                      var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
                    
                      //code to fetch pause timestamp second                    
                      var pauseTimestampSecond=+(valpauseTimeStamp);                    
                    
                      //code to get difference between pause-time-stamp & resume-time-stamp                    
                      var timeDiff=(resumeTimeSeconds - pauseTimestampSecond);
                    
                      //code to add timeDif & background time seconds
                      var totalSeconds = (seconds + timeDiff);
                    
                      //code to convert totalSeconds to time format
                      var numhours = Math.floor(((totalSeconds % 31536000) % 86400) / 3600);
                      var numminutes = Math.floor((((totalSeconds % 31536000) % 86400) % 3600) / 60);
                      var numseconds = (((totalSeconds % 31536000) % 86400) % 3600) % 60;
                    
                      var numhours_print = ("0" + numhours).slice(-2);
                      var numminutes_print = ("0" + numminutes).slice(-2);
                      var numseconds_print = ("0" + numseconds).slice(-2);
                    
                      //this.timer = numhours + ":" + numminutes + ":" + numseconds;
                      var formatedTime = numhours_print + ":" + numminutes_print + ":" + numseconds_print;
                      
                      
                      const alert111 = this.alertCtrl.create({
                        title: 'time details',
                        message: 'resumetime=> '+resumetime+' | resumeTimeSeconds=>'+resumeTimeSeconds+'| saved bck time=>'+valTimerValueBackground+' | savedbckseconds=>'+seconds+' | timeDiff=>'+timeDiff+' | totalSeconds=>'+totalSeconds,
                        buttons: ['OK']
                      });
                      alert111.present();
                      
                      const alert222 = this.alertCtrl.create({
                        title: 'time details',
                        message: 'formatedTime=>'+formatedTime,
                        buttons: ['OK']
                      });
                      alert222.present();
                    
                      this.storage.set(this.keytimervalue,formatedTime);                    
                      //code to clear keytimervalueBackground
                      this.storage.set(this.keytimervalueBackground,'');                    
                      //code to clear pauseTimeStamp
                      this.storage.set(this.keyPausetimeStamp,'');
                    }//end of background saved time check
                    else
                    {
                      this.storage.set(this.keytimervalue,'');
                      this.storage.set(this.keytimervalueBackground,'');
                      this.storage.set(this.keyPausetimeStamp,'');
                    }
                  });
                }//end of pause time check
                else
                {
                  this.storage.set(this.keyPausetimeStamp,'');
                }
              });
            }//end of login check
            else
            {
              this.storage.set(this.keytimervalue,'');
              this.storage.set(this.keytimervalueBackground,'');
              this.storage.set(this.keyPausetimeStamp,'');
            }
          });          
        }//end of page check
        else
        {
          this.storage.set(this.keytimervalue,'');
          this.storage.set(this.keytimervalueBackground,'');
          this.storage.set(this.keyPausetimeStamp,'');
        }
      });
      
      //this.backgroundMode.enable();
      
      this.initPushNotification();
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
                    if(view.component.name!='TimerPage')
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
                    if(view.component.name!='TimerPage')
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

