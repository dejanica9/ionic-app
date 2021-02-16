import { AlertController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, Message } from '../services/data.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
// import { threadId } from 'worker_threads';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  public message: Message;
  allSubtasks = [];
  checklistInfo;
  newSubtask = '';
  preview = false;
  taskName: string;
  taskDesc: string;
  id: string;
  important = false;
  urgent = false;
  lastDayOfMonth = false;
  today = new Date();
  requestType = 'post';



  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public datePipe: DatePipe
  ) {
    activatedRoute.params.subscribe(val => {
      this.id = this.activatedRoute.snapshot.paramMap.get('id');
      this.getChecklistDetails(this.id);
    })

  }

  ngOnInit() {
    // this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.getChecklistDetails(this.id);
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }

  getListOfSubtasks(id, companyId) {

    this.data.getListOfSubtasks(id, companyId).subscribe(response => {
      this.allSubtasks = response['subTasks'];
     

    })
  }

  getChecklistDetails(id) {
    this.data.checklistDetails(id).subscribe(result => {
     
      this.checklistInfo = result;
      this.taskName = this.checklistInfo.name;
      this.taskDesc = this.checklistInfo.description;

      //////obrati paznju na zakomentarisano
      if (this.data.date === '') {
        this.data.getCurrentDate(this.checklistInfo.companyId).subscribe(response => {
          this.data.setDate(response);
          this.getListOfSubtasks(this.checklistInfo.id, this.checklistInfo.companyId);
        });
      }
      else {
        this.getListOfSubtasks(this.checklistInfo.id, this.checklistInfo.companyId);
      }

    })
  }


  addNewSubtask() {
    const data = {
      "companyId": this.checklistInfo.companyId,
      "name": this.newSubtask,
      "validDays": "montuewedthufrisatsun",
      "taskId": this.checklistInfo.id
    }
    this.data.quickCreateSubtask(data).subscribe(response => {
     
      this.getListOfSubtasks(this.checklistInfo.id, this.checklistInfo.companyId);
      this.newSubtask = '';

    })
  }


  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Prompt!',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Placeholder 1'
        },




      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }



  async noteDialog(subtask) {
  

    let data = {};
    const alert = await this.alertController.create({
      cssClass: 'alertCustomCss',
      header: subtask.name + '- Note ',
      mode: 'ios',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Type text here..'
        },
      ],
      buttons: [


        {
          text: 'Cancel',
          cssClass: 'dejana',

        },
        {
          text: 'Save',
          cssClass: 'dejana111',
          handler: (alertData) => {
            if (alertData.name1 === '') return;
            let datas = {
              "subTaskId": subtask.id,
              "companyId": this.checklistInfo.companyId,
              "note": alertData.name1,
              "person": { "id": this.data.userId },
              "date": "2021-01-25",
              "taskDate": this.datePipe.transform(this.today, 'yyyy-MM-dd'),
              // "completedTime": "06:17 25/01/2021", nisam sigurna da li je ovo vazno kod dodavanja biljeske, pa je ostavljeno zakomentarisano
              // "completedDateTime": "2021-01-25T18:17:28.000+01:00",

            };
            if (subtask.result !== null && subtask.result !== undefined) {
              this.requestType = 'put';
            }
           
            this.data.addNoteForSubtask(datas, this.requestType).subscribe(response => {
            
              this.getListOfSubtasks(this.checklistInfo.id, this.checklistInfo.companyId);
            })
          }
        }]
    });

    await alert.present();
  }



  markAsNA(subtask) {
    let datas = {
      subTaskId: subtask.id,
      companyId: this.checklistInfo.companyId,
      person: { "id": this.data.userId },
      taskDate: this.datePipe.transform(this.today, 'yyyy-MM-dd'),
      completedTime: this.datePipe.transform(this.today, 'HH:mm dd-MM-yyyy'),
      completedDateTime: this.datePipe.transform(this.today, 'yyyy-MM-ddTHH:mmZ'),
      completed: false,
      na: true
    }

  
    this.data.markAsNotApplicable(datas,this.requestType).subscribe(response => {
     
      this.getListOfSubtasks(this.checklistInfo.id, this.checklistInfo.companyId);
    })

  }

  markAsCompleted(subtaskData, event) {
    if (subtaskData.result !== null && subtaskData.result !== undefined) {
      this.requestType = 'put';
    }
  
    let data = {
      "subTaskId": subtaskData.id,
      "companyId": this.checklistInfo.companyId,
      "person": { "id": this.data.userId },
      "taskDate": this.datePipe.transform(this.today, 'yyyy-MM-dd'),
      "completedTime": this.datePipe.transform(this.today, 'HH:mm dd-MM-yyyy'),
      "completedDateTime": this.datePipe.transform(this.today, 'yyyy-MM-ddTHH:mmZ'),
      "completed": event.detail.checked,
      "na": false,
    }
   
    this.data.markAsCompletedSubtask(data, this.requestType).subscribe(response => {
      
      this.getListOfSubtasks(this.checklistInfo.id, this.checklistInfo.companyId);
    })

  }

  details(id) {
    let d = document.getElementById(id);
    if (d.style.display === "none") {
      d.style.display = "block";
    }
    else {
      d.style.display = "none"
    }
  }

}

