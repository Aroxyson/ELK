import { Component } from '@angular/core';
import {Flags} from './core/flags';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  flags = new Flags();
  quantity: number;

  setFlags(flagsIn: Flags) {
    this.flags = flagsIn;
  }

  setNotifQuantity(quantity: number) {
    this.quantity = quantity;
  }
}
