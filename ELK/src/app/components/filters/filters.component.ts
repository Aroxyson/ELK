import {Component, OnInit, Output} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {Flags} from '../../core/flags';
import {dateSortOrder} from '../../core/dateSortOrder';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Output() flagsOut: EventEmitter<Flags> = new EventEmitter<Flags>();

  flags = new Flags();

  constructor() {}

  ngOnInit() {
    this.flags = new Flags();
  }

  emitChanges() {
    this.flagsOut.emit(Object.assign({}, this.flags));
    console.log(this.flagsOut);
    this.flags.dateSortForced = false;
    console.log(this.flagsOut);
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
    this.flags.dateSortForced = true;
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
}
