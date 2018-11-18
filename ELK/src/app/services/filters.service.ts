import { Injectable } from '@angular/core';
import {Flags} from '../core/flags';
import {Notification} from '../core/notification';
import {dateSortOrder} from '../core/dateSortOrder';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor() { }

  filterByFlag(notification: Notification[], flags: Flags): Notification[] {
    function isContainAll(notificationFunc: Notification, flagsFunc: Flags): boolean {
      for (const key in flagsFunc) {
        if ((flagsFunc[key] === true) && (notificationFunc.type === key)) {
          return true;
        }
      }
    }
    if (!flags) {
      return notification;
    }
    return notification.filter
    (item => isContainAll(item, flags));
  }

  sortNotificationsByName(notifications: Notification[], order: boolean): Notification[] {
    let comparator;
    const directCompareByName = function(a: Notification, b: Notification) {
      return a.name > b.name ? 1 : -1;
    };

    switch (order) {
      case true:
        comparator = directCompareByName;
        break;
      case false:
        comparator = function(a: Notification, b: Notification) {
          return directCompareByName(a, b) * (-1);
        };
        break;
    }
    return notifications.sort(comparator);
  }

  sortNotificationsByDate(notifications: Notification[], order: dateSortOrder): Notification[] {
    let comparator;
    const directCompareByDate = function(a: Notification, b: Notification) {
      return a.date > b.date ? 1 : -1;
    };

    switch (order) {
      case dateSortOrder.oldToNew:
        comparator = directCompareByDate;
        break;
      case dateSortOrder.newToOld:
        comparator = function(a: Notification, b: Notification) {
          return directCompareByDate(a, b) * (-1);
        };
        break;
    }
    return notifications.sort(comparator);
  }
}
