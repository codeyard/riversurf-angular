import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'surf-time-line-line',
  templateUrl: './time-line-line.component.html',
  styleUrls: ['./time-line-line.component.scss']
})
export class TimeLineLineComponent implements OnInit {

    @Input() previous : boolean = false;
    @Input() next : boolean = false;
    @Input() ongoing : boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
