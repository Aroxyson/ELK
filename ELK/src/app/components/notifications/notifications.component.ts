import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RestApiService} from '../../services/rest-api.service';
import {Notification} from '../../core/notification';
import {FiltersService} from '../../services/filters.service';
import {Flags} from '../../core/flags';
import {dateSortOrder} from '../../core/dateSortOrder';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnChanges {
  @Input() flags: Flags;
  @Output() quantityOut: EventEmitter<number> = new EventEmitter<number>();

  notifications: Notification[] = [];
  notificationsFiltered: Notification[] = [];
  notificationsView: Notification[] = [];
  queueFunc: Array<any> = [];
  checkedNotifications: Notification[] = [];
  start = 0;
  showingNotifications = 10;

  constructor(private restApiService: RestApiService, private filterService: FiltersService) {}

  ngOnInit() {
    this.initNotifications();
  }

  ngOnChanges(changes: SimpleChanges) {
    const current = changes.flags.currentValue;
    const previous = changes.flags.previousValue;
    const queue = new Queue(this.queueFunc);

    function Queue(arrayFunc: Array<any>) {
      this.run = function() {
        for (let i = 0; i < arrayFunc.length; i++) {
          if (typeof arrayFunc[i] === 'function') {
            arrayFunc[i]();
          }
        }
      };
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
        this.notificationsFiltered = this.notificationsFiltered.map(notification => {
          this.setChecked(notification);
          notification.checked = current.checkAll;
          return notification;
        });
      }
      if (current.nameSort !== previous.nameSort) {
        this.queueFunc = this.queueFunc.length >= 2 ? this.queueFunc.slice(1, 2) : this.queueFunc;
        this.queueFunc.push(this.nameSort(previous, current));
      }
      if (current.dateSortOrder !== previous.dateSortOrder) {
        this.queueFunc = this.queueFunc.length >= 2 ? this.queueFunc.slice(1, 2) : this.queueFunc;
        this.queueFunc.push(this.dateSort(current));
      }
    }

    queue.run();

    this.notificationsView = this.notificationsFiltered.slice(0, this.showingNotifications);
    if (this.notificationsView.length < this.showingNotifications) {
      this.start = this.notificationsFiltered.length;
    } else {
      this.start = this.showingNotifications;
    }
  }

  onScroll() {
    console.log(this.start);
    this.appendItems(this.showingNotifications);
  }

  appendItems(limit: number) {
    for (let i = this.start; i < this.start + limit; i++) {
      if (i >= this.notificationsFiltered.length) {
        this.start = this.notificationsFiltered.length;
        return;
      } else {
        this.notificationsView.push(this.notificationsFiltered[i]);
      }
    }
    this.start += limit;
  }

  sendNotifQuantity() {
    this.quantityOut.emit(this.notifications.length);
  }

  initNotifications() {
    this.restApiService.receiveItems().subscribe((notifications) => {
      this.notifications = notifications;
      this.notificationsFiltered = this.notifications;
      this.sendNotifQuantity();
      this.start = 0;
      this.appendItems(this.showingNotifications);
    }, error => {
      console.log(error.message);
    });
  }

  nameSort(previous: Flags, current: Flags) {
    if (current.nameSort) {
      this.notificationsFiltered = this.filterService.sortNotificationsByName(this.notificationsFiltered, true);
      console.log('A->Z');
    } else {
      this.notificationsFiltered = this.filterService.sortNotificationsByName(this.notificationsFiltered, false);
      console.log('Z->A');
    }
  }

  dateSort(current: Flags) {
      this.notificationsFiltered = this.filterService.sortNotificationsByDate(this.notificationsFiltered, current);
  }

  setChecked(notification: Notification) {
    notification.checked = !notification.checked;
    if (notification.checked) {
      this.checkedNotifications.push(notification);
    } else {
      this.checkedNotifications.splice(this.checkedNotifications.indexOf(notification), 1);
    }
  }

  markAs(id: string) {
    switch (id) {
      case 'as-archive':
        // this.notificationsFiltered = this.notificationsFiltered.map(notification => {
        //   if (notification.checked) {
        //     this.notificationsFiltered.splice(this.notificationsFiltered.indexOf(notification), 1);
        //     console.log(this.notificationsFiltered);
        //   }
        //   return notification;
        // });
        break;
      case 'as-read':
        this.notificationsFiltered = this.notificationsFiltered.map(notification => {
          if (notification.checked) {
            notification.read = true;
          }
          return notification;
        });
        break;
      case 'as-important':
        this.notificationsFiltered = this.notificationsFiltered.map(notification => {
          if (notification.checked) {
            notification.important = true;
          }
          return notification;
        });
        break;
    }
  }

}
