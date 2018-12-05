import {Component, OnInit, Output} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {Flags} from '../../core/flags';
import {dateSortOrder} from '../../core/dateSortOrder';
import * as moment from 'moment';
import {FormControl, FormGroup} from "@angular/forms";
import {nameSortOrder} from "../../core/nameSortOrder";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Output() flagsOut: EventEmitter<Flags> = new EventEmitter<Flags>();

  private flags = new Flags();
  private tempDateStart: moment.Moment;
  private tempDateEnd: moment.Moment;
  private datePattern: Array<string> = ['DD-MM-YYYY', 'DD.MM.YYYY', 'DD/MM/YYYY'];
  dateForm: FormGroup;
  isDatePeriodWrong = false;
  inputDateDisabled = true;

  constructor() {}

  ngOnInit() {
    this.flags = new Flags();
    this.dateForm = new FormGroup({
      'startDate': new FormControl('', [dateValidator]),
      'endDate': new FormControl('', [dateValidator]),
    }, {validators: datePeriodValidator});
  }

  get startDate() {return this.dateForm.get('startDate'); }
  get endDate() {return this.dateForm.get('endDate'); }

  emitChanges() {
    this.flagsOut.emit(Object.assign({}, this.flags));
  }

  addToFlags(input: HTMLInputElement) {
    switch (input.id) {
      case 'nameSortOrder':
        this.flags.nameSortOrder = this.flags.nameSortOrder === nameSortOrder.straight ? nameSortOrder.reverse : nameSortOrder.straight;
        break;
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

  addDateSort(input: HTMLInputElement) {
    switch (input.id) {
      case 'newToOld':
        this.flags.dateSortOrder = dateSortOrder.newToOld;
        break;
      case 'oldToNew':
        this.flags.dateSortOrder = dateSortOrder.oldToNew;
        break;
    }
    this.flags.nameSortOrder = nameSortOrder.disabled;
    this.flags.dateFilterStart = undefined;
    this.flags.dateFilterEnd = undefined;
    this.emitChanges();

    this.enableInput(false);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  enableInput(checkedStatus: boolean) {
    if (checkedStatus) {
      this.startDate.enable();
      this.endDate.enable();
    } else {
      this.tempDateStart = this.tempDateEnd = undefined;
      this.startDate.disable();
      this.endDate.disable();
      this.startDate.setValue('');
      this.endDate.setValue('');
      this.inputDateDisabled = true;
      document.getElementById('tcal').style.visibility = '';
    }
  }

  validateDate(inputElement: HTMLInputElement) {
    this.isDatePeriodWrong = false;

    if (this.isPeriodRight(inputElement)) {
      this.flags.dateFilterStart = this.tempDateStart;
      this.flags.dateFilterEnd = this.tempDateEnd;
      this.flags.dateSortOrder = dateSortOrder.newToOld;
    }

    this.emitChanges();
  }

  isPeriodRight(inputElement: HTMLInputElement) {
    switch (inputElement.id) {
      case 'startDate':
        if (inputElement.value === '') {
          this.flags.dateFilterStart = this.tempDateStart =undefined;
        } else {
          this.tempDateStart = moment(inputElement.value, this.datePattern, true);
        }
        break;
      case 'endDate':
        if (inputElement.value === '') {
          this.flags.dateFilterEnd = this.tempDateEnd = undefined;
        } else {
          this.tempDateEnd = moment(inputElement.value, this.datePattern, true).add(86399, 's');
        }
        break;
    }

    if (this.tempDateStart === undefined || this.tempDateEnd === undefined) {
      return false;
    }

    if (this.tempDateStart.isValid() && this.tempDateEnd.isValid()) {
      if (moment(this.tempDateStart).isBefore(this.tempDateEnd)) {
        return true;
      } else {
        this.isDatePeriodWrong = true;
      }
    }
  }
}

export function dateValidator(form: FormControl) {
  if (form.value === '') {
    return null;
  }

  if (moment(form.value, ['DD-MM-YYYY', 'DD.MM.YYYY', 'DD/MM/YYYY'], true).isValid()) {
    return { validDate: true };
  } else {
    return { invalidDate: true };
  }
}

export function datePeriodValidator(control: FormGroup) {
  const startDateString = control.get('startDate').value;
  const endDateString = control.get('endDate').value;
  const startDate = moment(startDateString, ['DD-MM-YYYY', 'DD.MM.YYYY', 'DD/MM/YYYY'], true);
  const endDate = moment(endDateString, ['DD-MM-YYYY', 'DD.MM.YYYY', 'DD/MM/YYYY'], true);

  if (!(startDate.isValid() && endDate.isValid())) {
    return;
  }

  if (startDate.isBefore(endDate)) {
    return null;
  } else {
    return { invalidPeriod: true }
  }
}
