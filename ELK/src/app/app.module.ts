import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import {RestApiService} from './services/rest-api.service';
import {HttpClientModule} from '@angular/common/http';
import { FiltersComponent } from './components/filters/filters.component';
import {FiltersService} from './services/filters.service';

@NgModule({
  declarations: [
    AppComponent,
    NotificationsComponent,
    FiltersComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule
  ],
  providers: [RestApiService, FiltersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
