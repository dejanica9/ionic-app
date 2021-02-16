import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubtaskSettingsPageRoutingModule } from './subtask-settings-routing.module';

import { SubtaskSettingsPage } from './subtask-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubtaskSettingsPageRoutingModule
  ],
  declarations: [SubtaskSettingsPage]
})
export class SubtaskSettingsPageModule {}
