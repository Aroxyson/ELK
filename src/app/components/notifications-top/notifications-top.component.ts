import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  host: {'(document:click)':'showNotifications($event.target)'},
  selector: 'app-notifications-top',
  templateUrl: './notifications-top.component.html',
  styleUrls: ['./notifications-top.component.css']
})
export class NotificationsTopComponent implements OnInit, OnChanges {
  @Input() notificationsIn: Notification[];
  notifications: Notification[] = [];
  notificationsView: Notification[] = [];
  visibility = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const notifLimit = 4;
    console.log(changes.notificationsIn.currentValue);
    this.notifications = changes.notificationsIn.currentValue;
    this.notificationsView = this.notifications.slice(0, 4);
  }

  showNotifications(target: HTMLElement) {
    const topNotifications = document.getElementById('top-notifications');
    const showTopNotifications = document.getElementById('show-top-notifs');

    if (this.visibility === false) {
      if (showTopNotifications.contains(target)) {
        this.visibility = true;
        return;
      }
    }
    if (this.visibility === true) {
      if (!topNotifications.contains(target)){
        this.visibility = false;
        return;
      }
    }
  }

  deleteNotification(notification: Notification) {
    this.notifications.splice(this.notifications.indexOf(notification),1);
    this.notificationsView = this.notifications.slice(0, 4);
  }
}
