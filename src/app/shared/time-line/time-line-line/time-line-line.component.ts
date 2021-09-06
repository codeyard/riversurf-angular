import {Component, Input} from '@angular/core';

@Component({
    selector: 'rs-time-line-line',
    templateUrl: './time-line-line.component.html',
    styleUrls: ['./time-line-line.component.scss']
})
export class TimeLineLineComponent {

    @Input() previous: boolean = false;
    @Input() next: boolean = false;
    @Input() ongoing: boolean = false;

    constructor() {
    }
}
