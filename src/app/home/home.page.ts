import { Router } from '@angular/router';
// import { DataService } from './../services/data.service';
import { Route } from '@angular/compiler/src/core';
import { Component, ViewChild } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private data: DataService,
    public route: Router,
    private activatedRoute: ActivatedRoute) {


    this.data.checklistRefresh.subscribe(result => {
      console.log('sad', result)
      if (result === true) {
        this.getChecklistsForDate();
      }
    });
    this.initializeApp();
  }

  @ViewChild('content') content: any;

  allOutlets = [];
  outletId = '';
  date: string;
  checklists;
  outletInformations = [];
  newChecklist = '';
  checklistLabel = false;




  initializeApp() {
    this.getOutletsForUser();
    document.body.scrollTop = 0;



  }
refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }



  getOutletsForUser() {

    return this.data.getAllOutlets().subscribe(result => {
      this.allOutlets = result;

      console.log('outleti za usera', result);
    });

  }

  getChecklistsForDate() {
    return this.data.getChecklistForDate(this.date, this.outletId, this.outletInformations['corporateId']).subscribe(result => {
      console.log('checklista za datum', result); //ovo je dobro
      this.checklists = result;
    });
  }


  getCurrentDateForOutlet(id) {
    this.outletId = id;

    this.allOutlets.forEach(value => {
      if (value.id === id) {
        this.outletInformations = (value);

      }
    });
    this.data.getCurrentDate(id).subscribe(result => {
      this.date = result;
      this.data.setDate(result);
      // console.log('trenutni datum za outlet:', this.date);
      this.getChecklistsForDate();
    });


  }

  preview() {
    this.checklistLabel = true;
    if (this.checklistLabel === true) {
      this.content.scrollToBottom();
    }


  }

  addNewChecklist() {
    // console.log('neke info', this.outletInformations)
    let data = {
      "name": this.newChecklist,
      "validDays": "montuewedthufrisatsun",
      "companyId": this.outletId,
      "corporateId": this.outletInformations['corporateId'],
      "personId": this.data.userId
    }
    this.data.createQuickChecklist(data).subscribe(response => {
      this.newChecklist = '';
      this.getChecklistsForDate();



    });
  }



}
