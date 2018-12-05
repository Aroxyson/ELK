import {dateSortOrder} from './dateSortOrder';
import * as moment from 'moment';
import {nameSortOrder} from "./nameSortOrder";

export class Flags {
  request = false;
  approval = false;
  revision = false;
  nameSortOrder: nameSortOrder = nameSortOrder.disabled;
  dateSortOrder: dateSortOrder = dateSortOrder.disabled;
  dateFilterStart: moment.Moment;
  dateFilterEnd: moment.Moment;
  important = false;
  checkAll = false;
  searchFilter = '';
}
