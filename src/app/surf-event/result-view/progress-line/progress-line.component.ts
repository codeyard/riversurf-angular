import {Component, Input, OnInit, QueryList} from '@angular/core';
import {RiderResultComponent} from "../../surf-event/competition/round/rider-result/rider-result.component";
import {Line} from "../result-view.component";

@Component({
  selector: 'rs-progress-line',
  templateUrl: './progress-line.component.html',
  styleUrls: ['./progress-line.component.scss']
})
export class ProgressLineComponent implements OnInit {

    @Input() results!: QueryList<any>;
    @Input() lines!: Line[];

  constructor() { }

  ngOnInit(): void {
  }

}
