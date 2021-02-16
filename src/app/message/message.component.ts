import { DataService } from './../services/data.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../services/data.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: Message;

  constructor(public alertController: AlertController, public dataService: DataService) { }

  ngOnInit() {


    // this.getDetails();

  }


  getDetails() {
    this.dataService.checklistDetails(this.message.id).subscribe(res => {
    
    })
  }


  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
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
            this.dataService.deleteChecklist(this.message.id).subscribe(response => {
            
              this.dataService.initNextVal(true);
            });
          }
        }]
    });

    await alert.present();
  }

 


}
