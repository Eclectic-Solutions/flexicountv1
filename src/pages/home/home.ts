import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  public pepperonichk:boolean = true;
  userLanguage:string;
  curUserLanguage:string;
  
  @ViewChild('username') uname;
  @ViewChild('password') password;
  @ViewChild('siteloginurl') siteloginurl;
  
  data: string;
  datalogin: string;
  
  userUrlValue: string;
  
  
  keyuname:string = 'loginUserName';
  keypwd:string = 'loginUserPassword';
  keyremember:string = 'loginUserRemember';
  keylanguage:string = 'loginUserLanguage';
  
  keyconfirmsiteurl:string = 'loginUserConfirmSiteURL';
  keyUsertoken:string = 'loginUserToken';
  
  classVariable1: string = 'login_area cls-disp-none';
  classVariable2: string = 'login_area cls-disp-blck';
  
  key:string = 'alertScanQrSettings';
  key1:string = 'alertTimerSettings';
  keyalertack:string = 'alertAlertAcknowledgedSettings';

  constructor(public navCtrl: NavController, private storage: Storage, private http: Http, public alertCtrl: AlertController) {

  }
  
  ionViewDidLoad() {
  
    //this.storage.set(this.keyconfirmsiteurl,'');
    //this.storage.set(this.key,'');
    //this.storage.set(this.key1,'');
  
    this.storage.get('loginUserConfirmSiteURL').then((valLoginUserConfirmSiteURL) => {
    
      //alert(valLoginUserConfirmSiteURL);
    
      if(valLoginUserConfirmSiteURL)
      {      
	this.userUrlValue=valLoginUserConfirmSiteURL;	
	this.loadLanguages();
	
	this.storage.get('loginUserRemember').then((valLogRemember) => {
	
	  if(valLogRemember==true)
	  {
	    this.pepperonichk = true;	  
	    this.storage.get('loginUserName').then((valUserName) => {
	      this.uname.value = valUserName;	  
	    });
	  
	    this.storage.get('loginUserPassword').then((valUserPassword) => {
	      this.password.value = valUserPassword;	  
	    });
	  
	    this.storage.get('loginUserLanguage').then((valUserLanguage) => {
	      this.userLanguage = valUserLanguage;	  
	    });
	  
	  }
	  else
	  {
	    this.pepperonichk = false;
	    this.uname.value = '';
	    this.password.value = '';	  
	  }
    
	});
	
	this.classVariable1 = 'login_area cls-disp-blck';
	this.classVariable2 = 'login_area cls-disp-none';
	
      }
      else
      {
	this.classVariable1 = 'login_area cls-disp-none';
	this.classVariable2 = 'login_area cls-disp-blck';	
      }
      
    });
  
  }
  
  saveSiteConfirmUrl(){
    
    //alert(this.siteloginurl.value);
    //this.storage.set(this.keyconfirmsiteurl,this.siteloginurl.value);
    
    if(this.siteloginurl.value=='')
    {
      const alert = this.alertCtrl.create({	
	subTitle: 'Please enter site login URL',
	buttons: ['OK']
      });
      
      alert.present();
    }
    else
    {
      let urldataval=this.siteloginurl.value;      
      
      if(urldataval.indexOf('http')>=0 || urldataval.indexOf('https')>=0 || urldataval.indexOf('www')>=0)
      {
	const alert = this.alertCtrl.create({	
	  subTitle: 'Please enter a valid URL',
	  buttons: ['OK']
	});
	
	alert.present();
	
	this.siteloginurl.value='';
      }
      else
      {
	let final_site_login_url=this.siteloginurl.value+'.storetech.com';
	
	this.storage.set(this.keyconfirmsiteurl,final_site_login_url);
	this.userUrlValue=final_site_login_url;
	
	this.storage.set(this.key,false);
	this.storage.set(this.key1,true);
        this.storage.set(this.keyalertack,true);
	
	this.loadLanguages();
	
      }
      
    }
  }
  
  loadLanguages(){
  
    //alert('val: '+this.userUrlValue);
      
    //this.http.get('https://demofm.storetech.com/api/Mobile/GetCultures')
    
    this.http.get('https://'+this.userUrlValue+'/api/Mobile/GetCultures')
    .map(res => res.json())
    .subscribe(data =>{
	    this.data = data;
	    console.log(data);
	    
	    this.classVariable1 = 'login_area cls-disp-blck';
	    this.classVariable2 = 'login_area cls-disp-none';
	    
    },err => {
	    console.log(err);
	    
	    this.classVariable1 = 'login_area cls-disp-none';
	    this.classVariable2 = 'login_area cls-disp-blck';
    });
    
    
    
  }
  
  signup(){
  	if(this.uname.value == "admin", this.password.value == "password"){
  		const alert = this.alertCtrl.create({
		      title: 'Login Success',
		      subTitle: 'You have successfully logged in',
		      buttons: ['OK']
		    });
		    alert.present();
		    this.navCtrl.push(DashboardPage);
  	}
  	else{
  		const alert = this.alertCtrl.create({
		      title: 'Login Failed',
		      subTitle: 'Wrong username / password combination',
		      buttons: ['OK']
		    });
		    alert.present();
  	}

  }
  
  login(){
  
    let UserName = this.uname.value;
    let Password = this.password.value;
    
    UserName = UserName.trim();
    Password = Password.trim();
    
  
    console.log(Password);
    
    if(UserName=='')
    {
      const alert = this.alertCtrl.create({	
	subTitle: 'Please enter Username',
	buttons: ['OK']
      });
      alert.present();
      
    }
    else if(Password=='')
    {
      const alert = this.alertCtrl.create({	
	subTitle: 'Please enter Password',
	buttons: ['OK']
      });
      alert.present();
    }
    else
    {      
      //previos code
      
      if(this.userLanguage)
      {
	this.curUserLanguage = this.userLanguage;
      }
      else
      {
	this.curUserLanguage = this.data[0]['CultureID'];
      }
      
      if(this.pepperonichk==true)
      {
	this.storage.set(this.keyuname,UserName);
	this.storage.set(this.keypwd,Password);
	this.storage.set(this.keyremember,this.pepperonichk);
	this.storage.set(this.keylanguage,this.curUserLanguage);
	
      }
      else
      {
	this.storage.set(this.keyuname,'');
	this.storage.set(this.keypwd,'');
	this.storage.set(this.keyremember,this.pepperonichk);
	this.storage.set(this.keylanguage,'');
      }
      
      
      //user login code start
      
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      const requestOptions = new RequestOptions({ headers: headers });
      
      let postData = {
	"Username": UserName,
	"password": Password,
	"CultureID": this.curUserLanguage
      }      
      
      this.http.post("https://"+this.userUrlValue+"/api/Mobile/Login", postData, requestOptions)      
      .subscribe(datalogin =>{
      
	  //this.datalogin = datalogin;
	  console.log(datalogin);
	  console.log(datalogin.status);
	  //console.log(JSON.parse(datalogin));
	  
	  
	  let login_token = datalogin.json().Token;
	  console.log(login_token);
	  
	  if(datalogin.status==200)
	  {
	    if(login_token!='')
	    {
	      this.storage.set(this.keyUsertoken,login_token);
	    }
	    else
	    {
	      this.storage.set(this.keyUsertoken,'');
	    }
	    
	    this.navCtrl.push(DashboardPage);
	  }
	  else
	  {
	    const alert = this.alertCtrl.create({
	      title: 'Login Faliure',
	      subTitle: 'Invalid Login Credentials',
	      buttons: ['OK']
	    });
	    alert.present();		    
	    this.navCtrl.push(HomePage);
	  }
	    
      }, error => {
        //console.log(error);
	const alert = this.alertCtrl.create({
	  title: 'Login Faliure',
	  subTitle: 'Invalid Login Credentials',
	  buttons: [	    
	    {	  
	      text: 'OK',
	      handler: () => {
		this.navCtrl.push(HomePage);
	      }
	    }	  
	  ]
	});
	alert.present();
      });
    }
    
    
  }

}
