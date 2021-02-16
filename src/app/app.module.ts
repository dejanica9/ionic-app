import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import {
//   RoundProgressModule, RoundProgressConfig,
//   RoundProgressDefaults
// } from 'angular-svg-round-progressbar';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule, HttpClientModule,
    CommonModule,
    FormsModule,
    // RoundProgressModule

  ],

  providers: [
    StatusBar,
    SplashScreen,
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }

    // {
    //   provide: RoundProgressDefaults,
    //   useValue: {
    //     color: '#f00',
    //     background: '#0f0'
    //   }
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
