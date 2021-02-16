import { DataService } from './../services/data.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-checklists',
  templateUrl: './settings-checklists.page.html',
  styleUrls: ['./settings-checklists.page.scss'],
})
export class SettingsChecklistsPage implements OnInit {

  constructor(public alertController: AlertController,
    public dataService: DataService,
    public route: Router,
    private activatedRoute: ActivatedRoute) {
  }
  cent;
  totalLength;
  desc: string;
  checklistName: string = '';
  lastDayOfMonth = false;
  id: string = '';
  someModelIamUsing;
  email: string = '';
  data = {};







  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.dataService.checklistDetails(this.id).subscribe(response => {
    
      this.cent = response;
      this.email = this.cent['alertRecipients']
      this.desc = this.cent['description'];
      this.checklistName = this.cent.name;
      if (this.cent['description'] !== null) {
        this.totalLength = this.cent['description'].length;
      } else {
        this.totalLength = 0;
      }
      this.lastDayOfMonth = this.cent.lastDayOfMonth;
    })


  }
  getPreviuosUrl() {


    let url = this.dataService.getPreviousUrl();
    this.route.navigate([url]);
  }

  count() {
    this.totalLength = this.desc.length;
  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      cssClass: 'alertCustomCss',
      header: 'Delete Task',
      mode: 'ios',
      message: 'Are you sure that you want to delete the checklist?',
      buttons: [


        {
          text: 'Cancel',
          cssClass: 'dejana'
        },
        {
          text: 'Delete',
          cssClass: 'dejana111',
          handler: () => {
            this.dataService.deleteChecklist(this.cent.id).subscribe(response => {
            
              this.dataService.initNextVal(true);
              this.route.navigate(['/home'])
            });
          }
        }]
    });

    await alert.present();
  }


  save() {

    this.cent.description = this.desc;
    this.cent.name = this.checklistName;
    this.cent.lastDayOfMonth = this.lastDayOfMonth;
    this.cent.personId = this.dataService.userId;
    this.cent.alertRecipients = this.email;
   
    this.dataService.updateChecklist(this.cent).subscribe(response => {
   
      this.dataService.initNextVal(true);
      this.route.navigate(['/home']);
    })





  }

  onChange(event) {
    this.lastDayOfMonth = event.detail.checked;
  }

}
