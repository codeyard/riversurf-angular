import {Component, Input, OnInit, QueryList} from '@angular/core';
import {Line} from "../result-view.component";
import {Point} from "@angular/cdk/drag-drop";

@Component({
    selector: 'rs-progress-line',
    templateUrl: './progress-line.component.html',
    styleUrls: ['./progress-line.component.scss']
})
export class ProgressLineComponent implements OnInit {

    @Input() roundIndex!: number;
    @Input() points!: Point[];
    @Input() lines!: Line[];

    constructor() {
        console.log(this.lines)
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
    }



}
