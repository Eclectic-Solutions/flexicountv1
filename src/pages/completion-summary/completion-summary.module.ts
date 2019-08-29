import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompletionSummaryPage } from './completion-summary';

@NgModule({
  declarations: [
    CompletionSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(CompletionSummaryPage),
  ],
})
export class CompletionSummaryPageModule {}
