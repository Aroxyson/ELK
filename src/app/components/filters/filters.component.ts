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
  invalidVisibility = false;

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

  validateDate(inputElement: HTMLInputElement) {
    const inputDate = inputElement.value;
    const invalidFeedback = document.createElement("div");
    invalidFeedback.classList.add('invalid-feedback');
    invalidFeedback.textContent = 'Дата в формате дд.мм.ггг';

    this.invalidVisibility = false;
    inputElement.classList.remove('is-invalid');
    inputElement.classList.remove('is-valid');

    if (inputDate && moment(inputDate, ['DD-MM-YYYY', 'DD.MM.YYYY', 'DD/MM/YYYY'], true).isValid()) {

      inputElement.classList.remove('is-invalid');
      inputElement.classList.add('is-valid');
    } else {
      document.querySelector('label [id=startDate]')[0].style.display = 'block';
      //this.invalidVisibility = true;
      inputElement.classList.add('is-invalid');
    }

    if (!this.isPeriodRight(inputElement)) {
      this.invalidVisibility = true;
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
        this.tempDateStart = moment(inputElement.value);
        break;
      case 'endDate':
        this.tempDateEnd = moment(inputElement.value).add(86399, 's');;
        break;
    }

    if (this.tempDateStart === undefined || this.tempDateEnd === undefined) {
      return true;
    }

    if (this.tempDateStart && this.tempDateEnd) {
      return moment(this.tempDateStart).isBefore(this.tempDateEnd);
    }
  }
}
