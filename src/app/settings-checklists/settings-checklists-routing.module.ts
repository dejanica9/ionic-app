import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsChecklistsPage } from './settings-checklists.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsChecklistsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsChecklistsPageRoutingModule {}
