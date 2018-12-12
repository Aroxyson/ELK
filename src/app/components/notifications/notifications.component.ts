import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RestApiService} from '../../services/rest-api.service';
import {Notification} from '../../core/notification';
import {FiltersService} from '../../services/filters.service';
import {Flags} from '../../core/flags';
import {nameSortOrder} from "../../core/nameSortOrder";
import {dateSortOrder} from "../../core/dateSortOrder";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnChanges {
  @Input() flags: Flags;
  @Input() removedNotification: Notification;
  @Output() notificationsOut: EventEmitter<Notification[]> = new EventEmitter<Notification[]>();
  @Output() uncheckInput: EventEmitter<boolean> = new EventEmitter<boolean>();

  notifications: Notification[] = [];
  notificationsFiltered: Notification[] = [];
  notificationPopup: Notification = new Notification();
  checkedNotifications: Notification[] = [];
  viewLimit: number = 0;
  showingNotifications: number = 10;
  isNotificationsEmpty = false;
  lastSort: Function = function () {};

  constructor(private restApiService: RestApiService, private filterService: FiltersService) {
  }

  ngOnInit() {
    this.restApiService.receiveItems().subscribe((notifications) => {
      this.notifications = notifications;
      this.notificationsFiltered = this.notifications;
      this.notificationsOut.emit(this.notifications);
      this.viewLimit = 0;
      this.appendToView(this.showingNotifications);
    }, error => {
      console.log(error.message);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const flagsInitial = new Flags();
    const current = changes.flags ? changes.flags.currentValue : this.flags;
    const previous = changes.flags ? changes.flags.previousValue : flagsInitial;
    const removedNotification = changes.removedNotification ? changes.removedNotification.currentValue : undefined;

    if (!current.checkAll) {
      this.setUncheckedAll(this.notifications);
    }

    this.checkedNotifications = this.filterService.removeNotification(this.checkedNotifications, removedNotification);

    this.notificationsFiltered = this.filterService.filterByType(this.notifications, current);

    this.notificationsFiltered = this.filterService.filterByImportance(this.notificationsFiltered, current);

    this.notificationsFiltered = this.filterService.filterByDate(this.notificationsFiltered, current);

    this.notificationsFiltered = this.filterService.filterByName(this.notificationsFiltered, current.searchFilter);

    if (current.nameSortOrder !== previous.nameSortOrder) {
      this.lastSort = this.nameSort;
    }

    if (current.dateSortOrder !== previous.dateSortOrder) {
      this.lastSort = this.dateSort;
    }

    this.lastSort(current);

    if (current.checkAll) {
      let limit = this.notificationsFiltered.length < this.viewLimit ? this.notificationsFiltered.length : this.viewLimit;
      for (let i = 0; i < limit; i++) {
        this.setCheckedStatus(this.notificationsFiltered[i], true);
      }
    }

    this.isNotificationsEmpty = this.notificationsFiltered.length < 1;
    this.notificationsOut.emit(this.filterService.sortNotificationsByDate(this.notifications, dateSortOrder.newToOld));
  }

  appendToView(incLimit: number) {
    this.viewLimit += incLimit;
    this.viewLimit = this.viewLimit > this.notificationsFiltered.length ? this.notificationsFiltered.length : this.viewLimit;
  }

  setPopupData(event: Event, notification: Notification) {
    const element = <HTMLElement> event.target;
    if (element.classList.contains('notif-checkbox')) {
      event.stopPropagation();
      return;
    }
    this.notificationPopup = notification;
    notification.read = true;
  }

  setCheckedStatus(notification: Notification, checkedStatus: boolean) {
    notification.checked = checkedStatus;
    if (notification.checked) {
      this.checkedNotifications.push(notification);
    } else {
      this.checkedNotifications.splice(this.checkedNotifications.indexOf(notification), 1);
    }
  }

  setUncheckedAll(notifications: Notification[]) {
    this.checkedNotifications = [];
    return notifications.map( notification => {
      notification.checked = false;
    });
  }

  nameSort(current: Flags) {
    this.notificationsFiltered = this.filterService.sortNotificationsByName(this.notificationsFiltered, current.nameSortOrder);
  }

  dateSort(current: Flags) {
    this.notificationsFiltered = this.filterService.sortNotificationsByDate(this.notificationsFiltered, current.dateSortOrder);
  }

  markAs(id: string) {
    switch (id) {
      case 'as-archive':
        this.checkedNotifications.forEach(notification => {
          this.notifications.splice(this.notifications.indexOf(notification),1);
        });
        this.setUncheckedAll(this.notifications);
        this.uncheckInput.emit(true);
        this.notificationsOut.emit(this.notifications);
        break;
      case 'as-read':
        this.notifications = this.notificationsFiltered.map(notification => {
          if (notification.checked) {
            notification.read = true;
          }
          return notification;
        });
        break;
      case 'as-important':
        this.notifications = this.notificationsFiltered.map(notification => {
          if (notification.checked) {
            notification.important = true;
          }
          return notification;
        });
        break;
    }
  }

  markPopupAs(notification: Notification, id: string) {
    switch (id) {
      case 'as-archive-popup':
        this.notifications[this.notifications.indexOf(notification)].archive = false;
        break;
      case 'as-read-popup':
        this.notifications[this.notifications.indexOf(notification)].read = false;
        break;
      case 'as-important-popup':
        this.notifications[this.notifications.indexOf(notification)].important = false;
        break;
    }
  }
}
