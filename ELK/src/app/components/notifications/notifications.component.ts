import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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

  notifications: Notification[] = [];
  notificationsFiltered: Notification[] = [];
  queueFunc: Array<any> = [];

  constructor(private restApiService: RestApiService, private filterService: FiltersService) {}

  ngOnInit() {
    this.initNotifications();
  }

  ngOnChanges(changes: SimpleChanges) {

    const current = changes.flags.currentValue;
    const previous = changes.flags.previousValue;

    if (current.request || current.approval || current.revision) {
      this.notificationsFiltered = this.filterService.filterByFlag(this.notifications, current);
    } else {
      this.notificationsFiltered = this.notifications;
    }
    console.log(current.dateFilterStart);
    if (current.dateFilterStart && current.dateFilterEnd) {
      console.log('dateFilter');
      this.notificationsFiltered = this.filterService.filterByDate(this.notificationsFiltered, current);
    }

    function Queue(arrayFunc: Array<any>) {
      this.run = function() {
        for (let i = 0; i < arrayFunc.length; i++) {
          if (typeof arrayFunc[i] === 'function') {
            arrayFunc[i]();
          }
        }
      };
    }

    if (previous) {
      if (current.nameSort !== previous.nameSort) {
        this.queueFunc = this.queueFunc.length >= 2 ? this.queueFunc.slice(1, 2) : this.queueFunc;
        this.queueFunc.push(this.nameSort(previous, current));
      }
      if (current.dateSortOrder !== previous.dateSortOrder) {
        this.queueFunc = this.queueFunc.length >= 2 ? this.queueFunc.slice(1, 2) : this.queueFunc;
        this.queueFunc.push(this.dateSort(current));
      }
    }

    console.log(this.queueFunc);

    const queue = new Queue(this.queueFunc);
    queue.run();
  }

  initNotifications() {
    this.restApiService.receiveItems().subscribe((notifications) => {
      this.notifications = notifications;
      this.notificationsFiltered = this.notifications;
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

  showFlags() {console.log(this.flags); }

}
