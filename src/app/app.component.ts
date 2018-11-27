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

  setFlags(flagsIn: Flags) {
    this.flags = flagsIn;
  }

  setNotifications(notificationsIn: Notification[]) {
    this.notifications = notificationsIn;
  }
}
