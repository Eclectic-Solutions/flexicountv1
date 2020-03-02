import { Component, ViewChild } from '@angular/core';
import { Platform, AlertController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BackgroundMode } from '@ionic-native/background-mode';


//import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { FCM } from '@ionic-native/fcm';
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

  //constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private push: Push, private alertCtrl:AlertController, private http: Http, private storage: Storage, private nativeAudio: NativeAudio, private backgroundMode: BackgroundMode) {
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private fcm: FCM, private alertCtrl:AlertController, private http: Http, private storage: Storage, private nativeAudio: NativeAudio, private backgroundMode: BackgroundMode) {
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
      
      //this.initPushNotification();
      
      fcm.subscribeToTopic('all');
      
      fcm.getToken().then(token=>{
        console.log(token);
        //backend.registerToken(token);
        
        const alert = this.alertCtrl.create({
          title: 'Device Token',
          message: 'token=> '+token,
          buttons: ['OK']
        });
        alert.present();
        
        
      });
      
      fcm.onNotification().subscribe(data=>{
        
        //common code to background & foreground process
        
        //=====start code to call MetricAlertMonitoringDeliver api====
        
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
        
        //=====end code to call MetricAlertMonitoringDeliver api====
        
        //common code to background & foreground process
        
        if(data.wasTapped)
        {          
          console.log("Received in background");
          let view = this.nav.getActive();
          
          //code start => when app in foreground and action is not completed_cleaning and started_cleaning then call api
          
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
                  }
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
                    
                  }
                }
              ]
            
            });        
            alert.present();
          }          
          //code end => when app in foreground and action is not completed_cleaning and started_cleaning then call api
          else
          {
            //code for other condition => for other action
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
			if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
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
        }
        else
        {          
          console.log("Received in foreground");          
          this.play();
          let view = this.nav.getActive();
          
          //code start => when app in foreground and action is not completed_cleaning and started_cleaning then call api
          
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
                  }
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
                    
                  }
                }
              ]
            
            });        
            alert.present();
          }
          //code end => when app in foreground and action is not completed_cleaning and started_cleaning then call api
          else
          {
            //code for other condition => for other action
            
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
                      if(view.component.name!='TimerPage' && data.additionalData.Action!="completed_cleaning")
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
        };
      });
      
      fcm.onTokenRefresh().subscribe(token=>{
        console.log(token);
        //backend.registerToken(token);
        
        const alert = this.alertCtrl.create({
          title: 'Device Token',
          message: 'token=> '+token,
          buttons: ['OK']
        });
        alert.present();
        
        //code start: store device token in BAS
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });
        
        let postData = {
          "deviceToken": token
        }
        
        this.http.post("https://auth.biblicalarchaeology.org/pushnotification.php", postData, requestOptions)      
        .subscribe(datalogin =>{
            console.log(datalogin);
        }, error => {
          console.log(error);	
          
        });        
        //code end: store device token in BAS        
        this.storage.set(this.keydeviceToken,token);
        
        
      });
      
      
      
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
  
  
  
  
}

