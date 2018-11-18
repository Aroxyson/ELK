import {Component, OnInit, Output} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {Flags} from '../../core/flags';
import {dateSortOrder} from '../../core/dateSortOrder';
import * as moment from 'moment';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Output() flagsOut: EventEmitter<Flags> = new EventEmitter<Flags>();

  flags = new Flags();
  tempDateStart: moment.Moment;
  tempDateEnd: moment.Moment;

  constructor() {}

  ngOnInit() {
    this.flags = new Flags();
  }

  emitChanges() {
    this.flagsOut.emit(Object.assign({}, this.flags));
  }
  addToFlags(input: HTMLInputElement) {
    switch (input.nextSibling.firstChild.textContent) {
      case 'Заявка':
        this.flags.request = input.checked;
        break;
      case 'Согласование':
        this.flags.approval = input.checked;
        break;
      case 'На доработку':
        this.flags.revision = input.checked;
        break;
    }
    this.emitChanges();
    }

  addNameSort() {
    this.flags.nameSort = !this.flags.nameSort;
    this.emitChanges();
  }

  addDateSort(input: HTMLInputElement) {
    switch (input.id) {
      case 'newToOld':
        this.flags.dateSortOrder = dateSortOrder.newToOld;
        break;
      case 'oldToNew':
        this.flags.dateSortOrder = dateSortOrder.oldToNew;
        break;
    }
    this.emitChanges();
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  validateDate(event) {
    const inputElement = event.path[0];
    const inputDate = event.path[0].value;
    const regexpDate = '^(?:(?:31(\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\.)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^' +
      '(?:29(\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1' +
      '\\d|2[0-8])(\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[2-9]|[2-9]\\d)\\d{2})$';
    inputElement.nextSibling.style.visibility = 'hidden';
    inputElement.classList.remove('is-invalid');
    inputElement.classList.remove('is-valid');

    if (inputDate && inputDate.match(regexpDate)) {
      inputElement.nextSibling.style.visibility = 'hidden';
      inputElement.classList.remove('is-invalid');
      inputElement.classList.add('is-valid');
    } else {
      inputElement.nextSibling.textContent = 'Дата в формате дд.мм.ггг';
      inputElement.nextSibling.style.visibility = 'visible';
      inputElement.classList.add('is-invalid');
    }

    if (this.isPeriodRight(inputElement)) {
      this.flags.dateFilterStart = this.tempDateStart;
      this.flags.dateFilterEnd = this.tempDateEnd;
      this.emitChanges();
    } else {
      inputElement.nextSibling.style.visibility = 'visible';
      inputElement.nextSibling.textContent = 'Неверно задан период';
      inputElement.classList.add('is-invalid');
    }
  }

  isPeriodRight(inputElement: HTMLInputElement) {
    switch (inputElement.id) {
      case 'startDate':
        this.tempDateStart = moment(inputElement.value, 'DD-MM-YYYY');
        break;
      case 'endDate':
        this.tempDateEnd = moment(inputElement.value, 'DD-MM-YYYY');
        break;
    }
    if (this.tempDateStart === undefined || this.tempDateEnd === undefined) {
      console.log('undefined');
      return true;
    }

    if (this.tempDateStart && this.tempDateEnd) {
      console.log('isPeriodRight');
      return moment(this.tempDateStart).isBefore(this.tempDateEnd);
    }
  }
}
