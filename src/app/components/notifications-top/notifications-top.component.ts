import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  host: {'(document:click)':'showNotifications($event.target)'},
  selector: 'app-notifications-top',
  templateUrl: './notifications-top.component.html',
  styleUrls: ['./notifications-top.component.css']
})
export class NotificationsTopComponent implements OnInit, OnChanges {
  @Input() notificationsIn: Notification[];
  @Output() notificationsOutTop: EventEmitter<Notification[]> = new EventEmitter<Notification[]>();
  @Output() removedNotification: EventEmitter<Notification> = new EventEmitter<Notification>();
  notifications: Notification[] = [];
  notificationsView: Notification[] = [];
  visibility = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.notifications = changes.notificationsIn.currentValue;
    this.notificationsView = this.notifications.slice(0, 4);
  }

  showNotifications(target: HTMLElement) {
    const topNotifications = document.getElementById('top-notifications');
    const showTopNotifications = document.getElementById('show-top-notifs');

    if (!this.visibility) {
      if (showTopNotifications.contains(target)) {
        this.visibility = true;
        return;
      }
    }
    if (this.visibility) {
      if (!topNotifications.contains(target) && (!target.classList.contains('close-top-notif'))) {
        this.visibility = false;
        return;
      }
    }
  }

  deleteNotification(notification: Notification) {
    this.notifications.splice(this.notifications.indexOf(notification),1);
    this.notificationsView = this.notifications.slice(0, 4);
    this.notificationsOutTop.emit(this.notifications);
    this.removedNotification.emit(notification);
  }
}
