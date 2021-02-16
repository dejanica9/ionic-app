import { DatePipe } from '@angular/common';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { async } from '@angular/core/testing';
import { AlertController, PickerController } from '@ionic/angular';
import { DataService } from './../services/data.service';
import { ActivatedRoute, Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subtask-settings',
  templateUrl: './subtask-settings.page.html',
  styleUrls: ['./subtask-settings.page.scss'],

})
export class SubtaskSettingsPage implements OnInit {
  subtaskDetails;
  totalLength = 0;
  description;
  subtaskName;
  important = false;
  urgent = false;
  lastDayOfMonth = false;
  clock;
  time;
  previousUrl = '';





  constructor(
    private activatedRoute: ActivatedRoute,
    private DataService: DataService,
    private alertController: AlertController,
    public dataService: DataService,
    private route: Router,
    private datePipe: DatePipe) {
  }

  ngOnInit() {

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.getSubtaskDetails(id);

  }

  async deleteSubtaskDialog() {
    let alert = await this.alertController.create({
      cssClass: 'alertCustomCss',
      header: 'Delete Task',
      mode: 'ios',
      message: 'Are you sure that you want to delete the task?',
      buttons: [


        {
          text: 'Cancel',
          cssClass: 'dejana'
        },
        {
          text: 'Delete',
          cssClass: 'dejana111',
          handler: () => {

            this.dataService.deleteSubtask(this.subtaskDetails.id).subscribe(response => {
              this.route.navigate([this.previousUrl]);

            });
          }
        }]
    });

    await alert.present();
  }


  getSubtaskDetails(id) {
    this.DataService.getSubtaskDetails(id).subscribe(response => {


      this.subtaskDetails = response;
      this.previousUrl = '/message/' + this.subtaskDetails.taskId;
      if (this.subtaskDetails.completeByTime !== "" && this.subtaskDetails.completeByTime !== null) {
        this.clock = this.subtaskDetails.completeByTime;

      }
      if (this.subtaskDetails.urgent !== null) {
        this.urgent = this.subtaskDetails.urgent;
      }
      if (this.subtaskDetails.important !== null) {
        this.important = this.subtaskDetails.important;
      }
      if (this.subtaskDetails.lastDayOfMonth !== null) {
        this.lastDayOfMonth = this.subtaskDetails.lastDayOfMonth;
      }

      this.description = this.subtaskDetails.description;
      this.subtaskName = this.subtaskDetails.name;



      if (this.subtaskDetails.description !== null) {
        this.totalLength = this.subtaskDetails.description.length;
      }


    })

  }

  count() {

    this.totalLength = this.description.length;
  }


  onChange(event) {
    if (event.detail.value === "urgent") {
      this.urgent = event.detail.checked;
      this.subtaskDetails.urgent = this.urgent;
    }
    else if (event.detail.value === "important") {
      this.important = event.detail.checked;
      this.subtaskDetails.important = this.important
    }

    else if (event.detail.value === "lastDayOfMonth") {
      this.lastDayOfMonth = event.detail.checked;
      this.subtaskDetails.lastDayOfMonth = this.lastDayOfMonth;
    }
  }

  save() {

    this.subtaskDetails.description = this.description;
    this.subtaskDetails.name = this.subtaskName;
    this.subtaskDetails.completeByTime = this.time;

    this.dataService.updateSubtask(this.subtaskDetails).subscribe(response => {

      this.route.navigate([this.previousUrl]);
    });


  }


  dateChange(event) {
    if (this.clock === undefined) {
      let newDate = new Date(event.detail.value);
      this.time = newDate.getHours().toString() + ':' + ('0' + newDate.getMinutes().toString()).slice(-2)
    }
    else {
      this.time = event.detail.value;
    }

  }

  cancel() {
    this.route.navigate([this.previousUrl])
  }


}