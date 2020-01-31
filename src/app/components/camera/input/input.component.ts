import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  exposure: number = 101;
  redBalance: number = 66;
  blueBalance: number = 13;

  constructor() { }

  ngOnInit() { }

  @Output() exposureChange = new EventEmitter();
  @Output() redBalanceChange = new EventEmitter();
  @Output() blueBalanceChange = new EventEmitter();
  
  @Input()
  getExposure() {
    return this.exposure;
  }
    
  @Input()
  getRedBalance() {
    return this.redBalance;
  }
  
  @Input()
  getBlueBalance() {
    return this.blueBalance;
  }

  setExposureBalance(exposure: number) {
    this.exposure = exposure;
    this.exposureChange.emit(this.exposure);
  }

  setRedBalance(redBalance: number) {
    this.redBalance = redBalance;
    this.redBalanceChange.emit(this.redBalance);
  }

  setBlueBalance(blueBalance: number) {
    this.blueBalance = blueBalance;
    this.blueBalanceChange.emit(this.blueBalance);
  }

}
