import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RestApiService} from '../../services/rest-api.service';
import {Notification} from '../../core/notification';
import {FiltersService} from '../../services/filters.service';
import {Flags} from '../../core/flags';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnChanges {
  @Input() flags: Flags;
  @Input() notificationsIn: Notification[];
  @Output() notificationsOut: EventEmitter<Notification[]> = new EventEmitter<Notification[]>();

  notifications: Notification[] = [];
  notificationsFiltered: Notification[] = [];
  notificationsView: Notification[] = [];
  queueFunc: Array<any> = [];
  checkedNotifications: Notification[] = [];
  start = 0;
  showingNotifications = 10;
  emptyResult = false;

  constructor(private restApiService: RestApiService, private filterService: FiltersService) {
  }

  ngOnInit() {
    this.initNotifications();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('sdfsdf');
    const queue = new Queue(this.queueFunc);

    function Queue(arrayFunc: Array<any>) {
      this.run = function () {
        for (let i = 0; i < arrayFunc.length; i++) {
          if (typeof arrayFunc[i] === 'function') {
            arrayFunc[i]();
          }
        }
      };
    }

    // if (changes.flags && this.notifications.length === 0) {
    //   alert('Уведомления отсутствуют');
    //   return;
    // }

    if (changes.flags) {
      const current = changes.flags.currentValue;
      const previous = changes.flags.previousValue;

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
        this.start = 0;
      }

      if (current.searchFilter) {
        this.notificationsFiltered = this.filterService.filterByName(this.notificationsFiltered, current.searchFilter);
        this.start = 0;
      }

      if (previous) {
        if (current.checkAll !== previous.checkAll) {
          for (let i = 0; i < this.notificationsView.length; i++) {
            this.setChecked(this.notificationsFiltered[i], current.checkAll);
          }
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

      if (previous && (this.notificationsFiltered.length === 0)) {
        if (this.notifications.length > this.showingNotifications) {
          this.notificationsView = this.notificationsFiltered.slice(0, this.showingNotifications);
        } else {
          this.notificationsView = this.notifications;
        }
        this.start = this.notificationsView.length;
        this.emptyResult = true;
        return;
      }
    }

    if (this.notificationsView.length === 0) {
        this.notificationsView.length = (this.notificationsFiltered.length < this.showingNotifications)? this.notificationsFiltered.length : this.showingNotifications;
    }

    this.notificationsView = this.notificationsFiltered.slice(0, this.notificationsView.length);
    this.start = this.notificationsView.length;
    this.emptyResult = false;
  }

  appendNotifs(limit: number) {
    console.log(this.start);
    console.log(this.notificationsFiltered);
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

  sendNotifications() {
    this.notificationsOut.emit(this.notifications);
  }

  initNotifications() {
    this.restApiService.receiveItems().subscribe((notifications) => {
      this.notifications = notifications;
      this.notificationsFiltered = this.notifications;
      this.sendNotifications();
      this.start = 0;
      this.appendNotifs(this.showingNotifications);
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

  setChecked(notification: Notification, checkedStatus: boolean) {
    notification.checked = checkedStatus;
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

}
