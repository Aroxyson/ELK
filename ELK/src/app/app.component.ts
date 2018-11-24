import { Component } from '@angular/core';
import {Flags} from './core/flags';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  flags = new Flags();
  checkedStatus = false;

  setFlags(flagsIn: Flags) {
    this.flags = flagsIn;
  }

  sendCheckedStatus(checked: boolean) {
    this.checkedStatus = checked;
  }
}
