import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArrivalConfirmationPage } from './arrival-confirmation';

@NgModule({
  declarations: [
    ArrivalConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(ArrivalConfirmationPage),
  ],
})
export class ArrivalConfirmationPageModule {}
