import { Component, ViewChild } from '@angular/core';
import { Platform, AlertController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';



import { HomePage } from '../pages/home/home';
import { AlertPage } from '../pages/alert/alert';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = HomePage;
  keydeviceToken:string = 'deviceToken';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private push: Push, private alertCtrl:AlertController, private http: Http, private storage: Storage) {
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
      
      this.initPushNotification();
    });
  }
  
  
  initPushNotification(){
    
    //check push notification permisson
    
    if (window.hasOwnProperty("cordova")) {
      this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do NOT have permission to send push notifications');
          
          const alert = this.alertCtrl.create({
            title: 'Notification Alert',
            message: 'We do not have permission to send notification. Please enable notification.',
            buttons: ['OK']
          });        
          alert.present();
        }
      });
    }
  
  
    const options: PushOptions = {
        android: {
          senderID: '112807975750'
        },
        ios: {
            alert: 'true',
            badge: true,
            sound: 'false'
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
              var headers = new Headers();
              headers.append("Authorization", 'Bearer '+valloginUserToken);       
              const requestOptions = new RequestOptions({ headers: headers });
              
              let postData = {
                "DomainID": data.DomainID,
                "StoreID": data.StoreID,
                "DepartmentID": data.DepartmentID
              }
              
              this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertMonitoringDeliver',postData,requestOptions)
              .map(res => res.json())
              .subscribe(data1 =>{                            
                //console.log(data1);
                
                const alert = this.alertCtrl.create({
                  title: 'Deliver API',
                  message: 'DomainID= '+ data.DomainID+', StoreID= '+data.StoreID+', DepartmentID= '+data.DepartmentID+', DeliveredDateTime= '+data1.DeliveredDateTime,
                  buttons: ['OK']
                });
                alert.present();
                
              },err => {
                //console.log(err);
                
                const alert = this.alertCtrl.create({
                  title: 'Deliver API Error',
                  message: 'error= '+ err+', DomainID= '+ data.DomainID+', StoreID= '+data.StoreID+', DepartmentID= '+data.DepartmentID,
                  buttons: ['OK']
                });
                alert.present();
              });
            }
            
          });
        }
        
      });
      
      //end code to call MetricAlertMonitoringDeliver api      
      
      console.log('message -> ' + data.message);      
      if(data.additionalData.foreground)
      { 
        const alert = this.alertCtrl.create({
          title: 'Notification',
          message: data.message,
          buttons:[
            {
              text:"OK",
              handler:()=>
              {
                //this.nav.push(AlertPage);
                
                //code to check wheather sitelogin url is stored or not
                
                this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
                
                  if(valLoginUserConfirmSiteURL)
                  {
                    //code to check user is logged in or not
                    
                    this.storage.get('loginUserToken').then((valloginUserToken) => {
                    
                      if(valloginUserToken!='')
                      {
                        //code to call MetricAlertMonitoringAcknowledge API
                        
                        var headers = new Headers();
                        headers.append("Authorization", 'Bearer '+valloginUserToken);       
                        const requestOptions = new RequestOptions({ headers: headers });
                        
                        let postData = {
                          "DomainID": data.DomainID,
                          "StoreID": data.StoreID,
                          "DepartmentID": data.DepartmentID
                        }
                        
                        this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertMonitoringAcknowledge',postData,requestOptions)
                        .map(res => res.json())
                        .subscribe(data1 =>{                            
                            //console.log(data1);
                            
                            const alert = this.alertCtrl.create({
                              title: 'ACK API',
                              message: 'DomainID= '+ data.DomainID+', StoreID= '+data.StoreID+', DepartmentID= '+data.DepartmentID+', AcknowledgedDateTime= '+data1.AcknowledgedDateTime,
                              buttons: ['OK']
                            });
                            alert.present();
                            
                            
                        },err => {
                            //console.log(err);                            
                            
                            const alert = this.alertCtrl.create({
                              title: 'ACK API Error',
                              message: 'error= '+ err+', DomainID= '+ data.DomainID+', StoreID= '+data.StoreID+', DepartmentID= '+data.DepartmentID,
                              buttons: ['OK']
                            });
                            alert.present();
                            
                        });
                        
                        
                        this.nav.push(AlertPage);
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
      else
      {
        //this.nav.push(AlertPage);
        
        //code to check wheather sitelogin url is stored or not
        
        this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
        
          if(valLoginUserConfirmSiteURL)
          {
            //code to check user is logged in or not
            this.storage.get('loginUserToken').then((valloginUserToken) => {
            
              if(valloginUserToken!='')
              {
                //code to call MetricAlertMonitoringAcknowledge API
                
                var headers = new Headers();
                headers.append("Authorization", 'Bearer '+valloginUserToken);       
                const requestOptions = new RequestOptions({ headers: headers });
                
                let postData = {
                  "DomainID": data.DomainID,
                  "StoreID": data.StoreID,
                  "DepartmentID": data.DepartmentID
                }
                
                this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/MetricAlertMonitoringAcknowledge',postData,requestOptions)
                .map(res => res.json())
                .subscribe(data1 =>{                    
                    //console.log(data1);
                    
                    const alert = this.alertCtrl.create({
                      title: 'ACK API',
                      message: 'DomainID= '+ data.DomainID+', StoreID= '+data.StoreID+', DepartmentID= '+data.DepartmentID+', AcknowledgedDateTime= '+data1.AcknowledgedDateTime,
                      buttons: ['OK']
                    });
                    alert.present();
                    
                    
                },err => {
                    //console.log(err);
                    
                    const alert = this.alertCtrl.create({
                      title: 'ACK API Error',
                      message: 'error= '+ err+', DomainID= '+ data.DomainID+', StoreID= '+data.StoreID+', DepartmentID= '+data.DepartmentID,
                      buttons: ['OK']
                    });
                    alert.present();
                });
                
                
                this.nav.push(AlertPage);
              }
              else
              {
                this.nav.push(HomePage);
              }
            
            });
            //this.nav.push(AlertPage);
          }
          else
          {
            this.nav.push(HomePage);
          }                  
        });
      }
    
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

