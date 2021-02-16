import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

export interface Message {
  fromName: string;
  subject: string;
  date: string;
  id: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_url = 'http://api-development.synergysuite.net/rest/';
  userId = '1490106392118050028';
  token = '99fddae8-5b6c-4027-b796-19785391f5b5';
  corporateId = '500000000';
  checklist;
  date = '';
  private currentUrl: string = undefined;
  public previousUrl: string = undefined;


  checklistInit = false;
  checklistRefresh = new BehaviorSubject(this.checklistInit);


  initNextVal(value) {
    this.checklistRefresh.next(value);
  }

  constructor(public http: HttpClient,
    private router: Router) {

    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        console.log('current', this.currentUrl)
        console.log('previ', this.previousUrl)
      };
    });

  }


  public getPreviousUrl() {
    return this.previousUrl;
  }


  getAllOutlets(): Observable<any> {
    let headers = new HttpHeaders().append('synergy-login-token', this.token);

    return this.http.get<any>(
      this.API_url + 'permission/allowedCompanies?userId=' + this.userId,
      { headers: headers });
  }


  getCurrentDate(outletId: string) {
    let headers = new HttpHeaders().append('synergy-login-token', this.token);

    return this.http.get<any>(
      this.API_url + 'companyDates/currentBusinessDate/' + outletId,

      { headers: headers });
  }

  getChecklistForDate(date, outletId, corporateId) {
    let api = this.API_url + 'checklists/tasks?date=' + date +
      '&companyId=' + outletId + '&corporateId=' + corporateId + '&personId=' + this.userId + '&type=CHECK_LIST';
    let headers = new HttpHeaders().append('synergy-login-token', this.token);
    return this.http.get<any>(
      api,
      { headers: headers });

  }

  checklistDetails(checkListId) {
    let headers = new HttpHeaders().append('synergy-login-token', this.token);

    return this.http.get<any>(
      this.API_url + 'checklists/tasks/' + checkListId,
      { headers: headers });
  }

  createQuickChecklist(checklist) {
    let headers = new HttpHeaders().append('synergy-login-token', this.token);

    return this.http.post<any>(
      this.API_url + 'checklists/tasks/CHECK_LIST', checklist, { headers: headers });
  }

  updateChecklist(data, type?: string) {
    let headers = new HttpHeaders().append('synergy-login-token', this.token);

    return this.http.post<any>(
      this.API_url + 'checklists/tasks/CHECK_LIST', data,
      { headers: headers });
  }

  deleteChecklist(id) {
   
    let headers = new HttpHeaders().append('synergy-login-token', this.token);

    return this.http.delete<any>(
      this.API_url + 'checklists/tasks/' + id,
      { headers: headers });
  }

  getListOfSubtasks(id, companyId) {

    let headers = new HttpHeaders().append('synergy-login-token', this.token);

    return this.http.get<any>(
      this.API_url + 'checklists/tasks/' + id +
      '/subtasks?id=' + id + '&companyId=' + companyId + '&personId=' + this.userId + '&date=' + this.date,
      { headers: headers });
  }


  getSubtaskDetails(id) {
    let headers = new HttpHeaders().append('synergy-login-token', this.token);

    return this.http.get<any>(
      this.API_url + 'checklists/subtasks/' + id,
      { headers: headers });
  }


  quickCreateSubtask(data) {
    let headers = new HttpHeaders().append('synergy-login-token', this.token);

    return this.http.post<any>(
      this.API_url + 'checklists/subtasks', data,
      { headers: headers });
  }


  updateSubtask(data) {
   
    let headers = new HttpHeaders().append('synergy-login-token', this.token);

    return this.http.post<any>(
      this.API_url + 'checklists/subtasks', data,
      { headers: headers });
  }

  deleteSubtask(id) {
    let headers = new HttpHeaders().append('synergy-login-token', this.token);

    return this.http.delete<any>(
      this.API_url + 'checklists/subtasks/' + id,
      { headers: headers });
  }







  markAsCompletedSubtask(data, ReqType?: string) {
  
    let headers = new HttpHeaders().append('synergy-login-token', this.token);
    if (ReqType === 'put') {
      return this.http.put<any>(
        this.API_url + 'checklists/subtasks/results/', data,
        { headers: headers });
    }
    else {
      return this.http.post<any>(
        this.API_url + 'checklists/subtasks/results/', data,
        { headers: headers });
    }



  }

  addNoteForSubtask(data, ReqType?: string) {
    let headers = new HttpHeaders().append('synergy-login-token', this.token);
    if (ReqType === 'put') {

      return this.http.put<any>(
        this.API_url + 'checklists/subtasks/results/', data,
        { headers: headers });
    }
    else {
      return this.http.post<any>(
        this.API_url + 'checklists/subtasks/results/', data,
        { headers: headers });
    }

  }

  markAsNotApplicable(data, ReqType?: string) {
    let headers = new HttpHeaders().append('synergy-login-token', this.token);
    if (ReqType === 'put') {
      return this.http.put<any>(
        this.API_url + 'checklists/subtasks/results/', data,
        { headers: headers }).pipe(
          catchError(this.handleError)
        );
    }
    else {
      return this.http.post<any>(
        this.API_url + 'checklists/subtasks/results/', data,
        { headers: headers }).pipe(
          catchError(this.handleError)
        );
    }

  }


  setDate(data) {
    this.date = data;
  
  }


  handleError(error) {

    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {

      // client-side error

      errorMessage = `Error: ${error.error.message}`;

    } else {

      // server-side error

      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

    }

    window.alert(errorMessage);

    return throwError(errorMessage);

  }


}
