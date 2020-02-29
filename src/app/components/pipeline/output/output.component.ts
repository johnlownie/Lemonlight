import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {

  options: Select2Options = { minimumResultsForSearch: -1, theme: 'lemonlight' };

  constructor() { }

  ngOnInit() {
  }

}
