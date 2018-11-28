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
  visibility = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const notifLimit = 4;
    this.notifications = changes.notificationsIn.currentValue.slice(0, notifLimit);
  }

  showNotifications(target: HTMLElement) {
    const topNotifications = document.getElementById('top-notifications');

    if (this.visibility === false) {
      if (target.id === 'show-top-notifs') {
        this.visibility = true;
        return;
      }
    }
    if (this.visibility === true) {
      if ((!topNotifications.contains(target))){
        this.visibility = false;
        return;
      }
    }
  }
}
