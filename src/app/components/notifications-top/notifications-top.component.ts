import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-notifications-top',
  templateUrl: './notifications-top.component.html',
  styleUrls: ['./notifications-top.component.css']
})
export class NotificationsTopComponent implements OnInit, OnChanges {
  @Input() notificationsIn: Notification[];
  notifications: Notification[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const notifLimit = 4;
    this.notifications = changes.notificationsIn.currentValue.slice(0, notifLimit);
  }

}
