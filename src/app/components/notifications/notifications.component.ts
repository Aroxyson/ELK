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
  @Input() notificationsIn: Notification[];
  @Input() removedNotification: Notification;
  @Output() notificationsOut: EventEmitter<Notification[]> = new EventEmitter<Notification[]>();

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
    this.initNotifications();
  }

  ngOnChanges(changes: SimpleChanges) {
    const current = changes.flags ? changes.flags.currentValue : this.flags;
    const previous = changes.flags ? changes.flags.previousValue : this.flags;
    const removedNotification = changes.removedNotification ? changes.removedNotification.currentValue : undefined;

    if (removedNotification) {
      this.checkedNotifications.splice(this.checkedNotifications.indexOf(removedNotification), 1);
    }

    if (current.request || current.approval || current.revision) {
      this.notificationsFiltered = this.filterService.filterByType(this.notifications, current);
    } else {
      this.notificationsFiltered = this.notifications;
    }

    if (current.important) {
      this.notificationsFiltered = this.filterService.filterByImportance(this.notificationsFiltered, current);
    }

    if (current.dateFilterStart && current.dateFilterEnd) {
      this.notificationsFiltered = this.filterService.filterByDate(this.notificationsFiltered, current);
    }

    if (current.searchFilter) {
      this.notificationsFiltered = this.filterService.filterByName(this.notificationsFiltered, current.searchFilter);
    }

    if (previous) {

      if (current.checkAll !== previous.checkAll) {
        if (current.checkAll === false) {
          this.notifications.map(notification => {
            notification.checked = false;
            this.checkedNotifications = [];
          });
        }
        if (current.checkAll === true) {
          let limit = this.notificationsFiltered.length < this.viewLimit ? this.notificationsFiltered.length : this.viewLimit;
          for (let i = 0; i < limit; i++) {
            this.setChecked(this.notificationsFiltered[i], true);
          }
        }
      }

      if (current.nameSortOrder !== nameSortOrder.disabled && current.nameSortOrder !== previous.nameSortOrder) {
        this.lastSort = this.nameSort;
      }

      if (current.dateSortOrder !== dateSortOrder.disabled && current.dateSortOrder !== previous.dateSortOrder) {
        this.lastSort = this.dateSort;
      }

      this.isNotificationsEmpty = this.notificationsFiltered.length <= 0;
    }

    this.lastSort(current);
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

  setChecked(notification: Notification, checkedStatus: boolean) {
    notification.checked = checkedStatus;
    if (notification.checked) {
      this.checkedNotifications.push(notification);
    } else {
      this.checkedNotifications.splice(this.checkedNotifications.indexOf(notification), 1);
    }
  }

  sendNotifications() {
    this.notificationsOut.emit(this.notifications);
  }

  initNotifications() {
    this.restApiService.receiveItems().subscribe((notifications) => {
      this.notifications = notifications;
      this.notificationsFiltered = this.notifications;
      this.sendNotifications();
      this.viewLimit = 0;
      this.appendToView(this.showingNotifications);
    }, error => {
      console.log(error.message);
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
        // this.notifications.map(notification => {
        //   if (notification.checked) {
        //     this.notifications.splice(this.notifications.indexOf(notification),1);
        //   }
        //   return notification;
        // });
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
