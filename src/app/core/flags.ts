import {dateSortOrder} from './dateSortOrder';
import * as moment from 'moment';

export class Flags {
  request = false;
  approval = false;
  revision = false;
  nameSort = false;
  dateSortOrder: dateSortOrder = dateSortOrder.disabled;
  dateFilterStart: moment.Moment;
  dateFilterEnd: moment.Moment;
  important = false;
  checkAll = false;
  searchFilter = '';
}
