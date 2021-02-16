import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsChecklistsPageRoutingModule } from './settings-checklists-routing.module';

import { SettingsChecklistsPage } from './settings-checklists.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsChecklistsPageRoutingModule
  ],
  declarations: [SettingsChecklistsPage]
})
export class SettingsChecklistsPageModule {}
