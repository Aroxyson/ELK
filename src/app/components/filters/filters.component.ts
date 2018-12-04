import {Component, Input, OnInit, Output} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {Flags} from '../../core/flags';
import {dateSortOrder} from '../../core/dateSortOrder';
import * as moment from 'moment';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Input() checkedStatus;
  @Output() flagsOut: EventEmitter<Flags> = new EventEmitter<Flags>();

  flags = new Flags();
  dateStart = '';
  dateEnd = '';
  tempDateStart: moment.Moment;
  tempDateEnd: moment.Moment;
  invalidPeriod = false;
  dateForm: FormGroup;

  constructor() {}

  ngOnInit() {
    this.flags = new Flags();
    this.dateForm = new FormGroup({
      'startDate': new FormControl(this.dateStart, [
        dateValidator,
        // datePeriodValidator(this.dateForm.controls.startDate, this.dateForm['endDate'])
      ]),
      'endDate': new FormControl(this.dateEnd, [dateValidator]),
    });
  }

  get startDate() {return this.dateForm.get('startDate'); }
  get endDate() {return this.dateForm.get('endDate'); }

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

    if (!this.isPeriodRight(inputElement)) {
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

export function dateValidator(form: FormControl) {
  if (moment(form.value, ['DD-MM-YYYY', 'DD.MM.YYYY', 'DD/MM/YYYY'], true).isValid()) {
    return null;
  } else {
    return { invalidDate: true }
  }
}

export function datePeriodValidator(formStart: FormControl, formEnd: FormControl) {
  if (moment(formStart.value).isBefore(moment(formEnd.value))) {
    return null;
  } else {
    return { invalidPeriod: true }
  }
}
