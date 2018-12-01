import { Component } from '@angular/core';
import {Flags} from './core/flags';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  flags: Flags = new Flags();
  notifications: Notification[] = [];
  notificationsTop: Notification[] = [];
  length: number = 0;

  setFlags(flagsIn: Flags) {
    this.flags = flagsIn;
  }

  setNotifications(notificationsIn: Notification[]) {
    this.notifications = Object.assign({}, notificationsIn);
    this.length = notificationsIn.length;
  }
  setNotificationsTop(notificationsIn: Notification[]) {
    this.notificationsTop = notificationsIn;
    this.length = notificationsIn.length;
  }
}
