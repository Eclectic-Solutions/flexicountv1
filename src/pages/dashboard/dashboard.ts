import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';
import { AlertPage } from '../alert/alert';
import { SettingsPage } from '../settings/settings';
import { SignoffPage } from '../signoff/signoff';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  keydeviceToken:string = 'deviceToken';
  keyUsertoken:string = 'loginUserToken';

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http,private alertController:AlertController, public platforms: Platform, private storage: Storage) {
  
  //let platForm = this.platform.platforms();    
  //console.log('current platform: '+platForm[0]);
  
   this.saveDeviceToken();
  
  }
  
  saveDeviceToken(){
  
   let cur_platform='';
   
   let platForm = this.platforms.platforms();
   //console.log(platForm[0]);
   
   if(this.platforms.is('ios'))
   {
    cur_platform = 'iOS';
   }
   else
   {
    cur_platform = 'Android';
   }
   
   console.log('cur_platform: '+cur_platform);
  
   this.storage.get('deviceToken').then((valdeviceToken) => {
   
    if(valdeviceToken)
    {
     
     this.storage.get('loginUserToken').then((valloginUserToken) => {
     
      if(valloginUserToken)
      {
        /*var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        const requestOptions = new RequestOptions({ headers: headers });*/
        
        var headers = new Headers();
        headers.append("Authorization", 'Bearer '+valloginUserToken);       
        const requestOptions = new RequestOptions({ headers: headers });
        
        let postData = {
         "TokenPayload": valdeviceToken,
         "Device": cur_platform
        }
        
        /*this.http.post("https://auth.biblicalarchaeology.org/pushnotification.php", postData, requestOptions)      
        .subscribe(datalogin =>{
          this.storage.set(this.keydeviceToken,'');
          console.log(datalogin);
        }, error => {
          console.log(error);
        });*/
        
        this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
        
           this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/AddDeviceToken', postData, requestOptions)
           .map(res => res.json())
           .subscribe(datalogin =>{
           
            //this.storage.set(this.keydeviceToken,'');
            console.log(datalogin);
             
           },err => {
           console.log(err);
          });
        
        });
      
      }     
     
     });
     
    }
   
   });
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }
  
  alertpg(){
   this.navCtrl.push(AlertPage);
  }
  
  logout(){
  
   //this.storage.set(this.keyUsertoken,'');   
   
   //api call for logout and send device token
   
   this.storage.get('deviceToken').then((valdeviceToken) => {
   
    if(valdeviceToken)
    {
     
     this.storage.get('loginUserToken').then((valloginUserToken) => {
     
      if(valloginUserToken)
      {
        var headers = new Headers();
        headers.append("Authorization", 'Bearer '+valloginUserToken);       
        const requestOptions = new RequestOptions({ headers: headers });
        
        let postData = {
         "TokenPayload": valdeviceToken
        }
        
        this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
        
           this.http.post('https://'+valLoginUserConfirmSiteURL+'/api/Mobile/RemoveDeviceToken', postData, requestOptions)
           .map(res => res.json())
           .subscribe(datalogin =>{
            
            this.storage.set(this.keyUsertoken,'');
            console.log(datalogin);
             
           },err => {
           console.log(err);
          });
        
        });
      
      }     
     
     });
     
    }
   
   });
   
   
   this.navCtrl.push(HomePage);    
  }
  
  settingpg(){
    this.navCtrl.push(SettingsPage);
  }
  
  signoffpg(){
    //this.navCtrl.push(SignoffPage);
    
    const alert = this.alertController.create({
      message: 'This option is currently disabled',
      buttons: ['OK']
    });
    alert.present();
  }
  
  registerHub(){    
    const alert = this.alertController.create({
      message: 'This option is currently disabled',
      buttons: ['OK']
    });
    alert.present();
  }
  
  registerSensor(){  
   const alert = this.alertController.create({
      message: 'This option is currently disabled',
      buttons: ['OK']
    });
    alert.present();  
  }
  
  viewDevices(){
   const alert = this.alertController.create({
      message: 'This option is currently disabled',
      buttons: ['OK']
    });
    alert.present();
  }

}
