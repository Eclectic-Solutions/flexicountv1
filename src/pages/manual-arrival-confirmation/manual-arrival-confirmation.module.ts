import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManualArrivalConfirmationPage } from './manual-arrival-confirmation';

@NgModule({
  declarations: [
    ManualArrivalConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(ManualArrivalConfirmationPage),
  ],
})
export class ManualArrivalConfirmationPageModule {}
