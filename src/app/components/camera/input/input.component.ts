import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  blue_balance = 25;

  constructor() { }

  ngOnInit() {
  }

  getBlueBalance() {
    return this.blue_balance;
  }
  
  setBlueBalance(blue_balance) {
    this.blue_balance = blue_balance;
  }

}
