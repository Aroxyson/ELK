import { Injectable } from '@angular/core';
import {Flags} from '../core/flags';
import {Notification} from '../core/notification';
import {dateSortOrder} from '../core/dateSortOrder';
import * as moment from 'moment';
import {nameSortOrder} from "../core/nameSortOrder";

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor() { }

  filterByType(notification: Notification[], flags: Flags): Notification[] {
    function isContainAny(notificationFunc: Notification, flagsFunc: Flags): boolean {
        for (const flag in flagsFunc) {
          if (flagsFunc[flag] && (notificationFunc.type === flag)) {
            return true;
          }
        }
    }

    if (!flags) {
      return notification;
    }

    return notification.filter
    (item => isContainAny(item, flags));
  }

  filterByImportance(notification: Notification[], flags: Flags): Notification[] {
    function isContain(notificationFunc: Notification, flagsFunc: Flags): boolean {
      if (flagsFunc.important && notificationFunc.important) {
        return true;
      }
    }

    if (!flags) {
      return notification;
    }

    return notification.filter
    (item => isContain(item, flags));
  }

  filterByDate(notifications: Notification[], flags: Flags): Notification[] {
    function isInPeriod(notification: Notification, flagsFunc: Flags): boolean {
      return (moment(notification.date).isBefore(flagsFunc.dateFilterEnd) && moment(flagsFunc.dateFilterStart).isBefore(notification.date));
    }
    return notifications.filter(item => isInPeriod(item, flags));
  }

  filterByName(notifications: Notification[], searchText: string): Notification[] {
    if (!searchText) {
      return notifications;
    }

    if (!notifications) {
      return [];
    }

    searchText = searchText.toLowerCase();

    return notifications.filter( item => {
      return item.text.toLowerCase().includes(searchText);
    });
  }

  sortNotificationsByName(notifications: Notification[], order: nameSortOrder): Notification[] {
    let comparator;
    const directCompareByName = function(a: Notification, b: Notification) {
      return a.name > b.name ? 1 : -1;
    };

    switch (order) {
      case nameSortOrder.disabled:
        return;
      case nameSortOrder.straight:
        comparator = directCompareByName;
        break;
      case nameSortOrder.reverse:
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
      case dateSortOrder.disabled:
        return;
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
