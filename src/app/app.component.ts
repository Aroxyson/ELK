import { Component } from '@angular/core';
import {Flags} from './core/flags';
import * as moment from "moment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  flags: Flags = new Flags();
  notifications: Notification[] = [];
  removedNotification: Notification;
  length: number = 0;
  uncheckInput = false;

  constructor() {
    moment.locale('ru');
  }
  setFlags(flagsIn: Flags) {
    this.flags = flagsIn;
  }

  setNotifications(notificationsIn: Notification[]) {
    this.notifications = notificationsIn;
    this.length = notificationsIn.length;
  }

  setRemovedNotification(notification: Notification) {
    this.removedNotification = notification;
  }

  setUncheckInput(value: boolean) {
    this.uncheckInput = value;
  }
}
