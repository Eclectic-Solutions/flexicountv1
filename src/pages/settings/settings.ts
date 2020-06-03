import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { DashboardPage } from '../dashboard/dashboard';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public pepperoni:boolean = true;
  key:string = 'alertScanQrSettings';
  
  public peppertimer:boolean = true;
  key1:string = 'alertTimerSettings';
  
  public pepperalert:boolean = true;
  keyalertack:string = 'alertAlertAcknowledgedSettings';
  
  
  keyconfirmsiteurl:string = 'loginUserConfirmSiteURL';
  
  siteName:string = 'Ikea.flexicount.com';

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    
    this.storage.get('loginUserConfirmSiteURL').then((siteUrlval) => {
     console.log(siteUrlval);
     if(siteUrlval!='')
     {
      this.siteName=siteUrlval;
     }
     else
     {
      this.siteName='demofm.flexicount.com';
     }
    });
    
    
    this.storage.get('alertScanQrSettings').then((val99) => {
     console.log(val99);
     if(val99==false)
     {
      this.pepperoni = false;
     }
     else
     {
      this.pepperoni = true;
     }
    });
    
    this.storage.get('alertTimerSettings').then((val98) => {
     console.log(val98);
     if(val98==false)
     {
      this.peppertimer = false;
     }
     else
     {
      this.peppertimer = true;
     }
    });
    
    this.storage.get('alertAlertAcknowledgedSettings').then((val77) => {
     console.log(val77);
     if(val77==false)
     {
      this.pepperalert = false;
     }
     else
     {
      this.pepperalert = true;
     }
    });
  }
  
  home(){
    this.navCtrl.push(DashboardPage);
  }
  
  back(){
    this.navCtrl.push(DashboardPage);
  }
  
  change(){
   this.storage.set(this.key,this.pepperoni);
   console.log(this.pepperoni);
   
  }
  
  changeTimerSettings()
  {
   this.storage.set(this.key1,this.peppertimer);
   console.log(this.peppertimer);
  }
  
  changeAlertAcknowledged()
  {
   this.storage.set(this.keyalertack,this.pepperalert);
   console.log(this.pepperalert);
  }
  
  
  editSiteLoginURL()
  {
  
    let full_url=this.siteName;
    let res = full_url.split(".");
    let res_store_name = res[0];
  
    let alert = this.alertCtrl.create({
    
     title: 'Change Store Name',
     subTitle: 'Enter store name',
     inputs:[{
      type:"text",
      name:"newSiteLoginURL",
      value:res_store_name
     }],
     buttons:[
      {
       text: "Cancel"
      },
      {
       text: "Update",
       handler:(inputData)=>{
        let siteText;
        siteText=inputData.newSiteLoginURL;
        //this.siteName=siteText;
        this.siteName=siteText+'.flexicount.com';
        let siteText1=siteText+'.flexicount.com';
        
        //this.storage.set(this.keyconfirmsiteurl,siteText);
        this.storage.set(this.keyconfirmsiteurl,siteText1);
        
       }
      }
     ]
     
    });
    alert.present();
  }

}
