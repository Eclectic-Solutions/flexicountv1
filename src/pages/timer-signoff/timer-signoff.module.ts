import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerSignoffPage } from './timer-signoff';

@NgModule({
  declarations: [
    TimerSignoffPage,
  ],
  imports: [
    IonicPageModule.forChild(TimerSignoffPage),
  ],
})
export class TimerSignoffPageModule {}
