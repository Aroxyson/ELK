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

  filterByType(notifications: Notification[], flags: Flags): Notification[] {
    function isContainAny(notificationFunc: Notification, flagsFunc: Flags): boolean {
      for (const flag in flagsFunc) {
        if (flagsFunc[flag] && (notificationFunc.type === flag)) {
          return true;
        }
      }
    }

    if (!notifications) {
      return;
    }

    if (flags.request || flags.approval || flags.revision) {
      return notifications.filter
      (item => isContainAny(item, flags));
    } else {
      return notifications;
    }
  }

  filterByImportance(notifications: Notification[], flags: Flags): Notification[] {
    if (!notifications) {
      return;
    }

    if (flags.important) {
      return notifications.filter
      (item => item.important);
    } else {
      return notifications;
    }
  }

  filterByDate(notifications: Notification[], flags: Flags): Notification[] {
    function isInPeriod(notification: Notification, flagsFunc: Flags): boolean {
      return (moment(notification.date).isBefore(flagsFunc.dateFilterEnd) && moment(flagsFunc.dateFilterStart).isBefore(notification.date));
    }

    if (!notifications) {
      return;
    }

    if (flags.dateFilterStart && flags.dateFilterEnd) {
      return notifications.filter(item => isInPeriod(item, flags));
    } else {
      return notifications;
    }
  }

  filterByName(notifications: Notification[], searchText: string): Notification[] {
    if (!notifications) {
      return [];
    }

    if (searchText) {
      searchText = searchText.toLowerCase();

      return notifications.filter( item => {
        return item.text.toLowerCase().includes(searchText);
      });
    } else {
      return notifications;
    }
  }

  sortNotificationsByName(notifications: Notification[], order: nameSortOrder): Notification[] {
    let comparator;
    const directCompareByName = function(a: Notification, b: Notification) {
      return a.name > b.name ? 1 : -1;
    };

    switch (order) {
      case nameSortOrder.disabled:
        return notifications;
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

    const notificationsTemp: Notification[] = Object.assign({}, notifications);
    console.log(notificationsTemp);
    console.log('noti', notifications);

    if (!notifications || notifications.length === 0) {
      console.log('ddfdfdfd');
      return [];
    }

    switch (order) {
      case dateSortOrder.disabled:
        return notifications;
      case dateSortOrder.oldToNew:
        comparator = directCompareByDate;
        break;
      case dateSortOrder.newToOld:
        comparator = function(a: Notification, b: Notification) {
          return directCompareByDate(a, b) * (-1);
        };
        break;
    }

    return notificationsTemp.sort(comparator);
  }

  removeNotification(notifications: Notification[], notification: Notification): Notification[] {
    if (!notifications) {
      return [];
    }

    if (notification) {
      return notifications.splice(notifications.indexOf(notification), 1);
    } else {
      return notifications;
    }
  }
}
