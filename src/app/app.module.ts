import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BackgroundMode } from '@ionic-native/background-mode';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';
import { Camera } from '@ionic-native/camera';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

//import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Push } from '@ionic-native/push';

import { Insomnia } from '@ionic-native/insomnia';

import { NativeAudio } from '@ionic-native/native-audio';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AlertPage } from '../pages/alert/alert';
import { SettingsPage } from '../pages/settings/settings';
import { ManualArrivalConfirmationPage } from '../pages/manual-arrival-confirmation/manual-arrival-confirmation';
import { ArrivalConfirmationPage } from '../pages/arrival-confirmation/arrival-confirmation';
import { TimerPage } from '../pages/timer/timer';
import { TimerSignoffPage } from '../pages/timer-signoff/timer-signoff';
import { CompletionSummaryPage } from '../pages/completion-summary/completion-summary';
import { SignoffPage } from '../pages/signoff/signoff';
import { Signoff2Page } from '../pages/signoff2/signoff2';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DashboardPage,
    AlertPage,
    SettingsPage,
    ManualArrivalConfirmationPage,
    ArrivalConfirmationPage,
    TimerPage,
    TimerSignoffPage,
    CompletionSummaryPage,
    SignoffPage,
    Signoff2Page
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DashboardPage,
    AlertPage,
    SettingsPage,
    ManualArrivalConfirmationPage,
    ArrivalConfirmationPage,
    TimerPage,
    TimerSignoffPage,
    CompletionSummaryPage,
    SignoffPage,
    Signoff2Page
  ],
  providers: [
    StatusBar,
    BarcodeScanner,
    SplashScreen,
    BackgroundMode,
    Keyboard,
    Camera,
    SQLite,
    Toast,
    Push,
    Insomnia,
    NativeAudio,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
