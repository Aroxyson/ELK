import {Component, Input, OnInit, Output} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {Flags} from '../../core/flags';
import {dateSortOrder} from '../../core/dateSortOrder';
import * as moment from 'moment';
import {FiltersService} from '../../services/filters.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Input() checkedStatus;
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
    switch (input.id) {
      case 'request':
        this.flags.request = input.checked;
        break;
      case 'approval':
        this.flags.approval = input.checked;
        break;
      case 'revision':
        this.flags.revision = input.checked;
        break;
      case 'importance':
        this.flags.important = input.checked;
        break;
      case 'check-all':
        this.flags.checkAll = input.checked;
        break;
      case 'search-filter':
        this.flags.searchFilter = input.value;
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
    this.flags.dateFilterStart = undefined;
    this.flags.dateFilterEnd = undefined;
    this.emitChanges();

    this.enableInput();
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  enableInput() {
    const radio: HTMLInputElement = document.querySelector('input[id="dateFilter"]');
    const startDate = <HTMLInputElement> document.getElementById('startDate');
    const endDate = <HTMLInputElement> document.getElementById('endDate');

    if (radio.checked) {
      startDate.disabled = false;
      endDate.disabled = false;
    } else {
      startDate.disabled = true;
      endDate.disabled = true;
      startDate.value = '';
      endDate.value = '';
      startDate.classList.remove('is-invalid');
      startDate.classList.remove('is-valid');
      startDate.classList.remove('tcalActive');
      endDate.classList.remove('is-invalid');
      endDate.classList.remove('is-valid');
      endDate.classList.remove('tcalActive');
      const tCal = document.getElementById('tcal');
      tCal.style.visibility = '';
    }
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

    if (!this.isPeriodRight(inputElement)) {
      inputElement.nextSibling.style.visibility = 'visible';
      inputElement.nextSibling.textContent = 'Неверно задан период';
      inputElement.classList.add('is-invalid');
    } else if (this.tempDateStart && this.tempDateEnd) {
      this.flags.dateFilterStart = this.tempDateStart;
      this.flags.dateFilterEnd = this.tempDateEnd;
      this.flags.dateSortOrder = dateSortOrder.newToOld;
      this.emitChanges();
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
