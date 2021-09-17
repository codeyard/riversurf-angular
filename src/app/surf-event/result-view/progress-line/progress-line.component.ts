import {Component, Input, OnInit, QueryList} from '@angular/core';
import {Line} from "../result-view.component";

@Component({
    selector: 'rs-progress-line',
    templateUrl: './progress-line.component.html',
    styleUrls: ['./progress-line.component.scss']
})
export class ProgressLineComponent implements OnInit {

    @Input() roundIndex!: number;
    @Input() results!: QueryList<any>;
    @Input() lines!: Line[];

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
    }

    getXoffset(cardIndex: number) {
        console.log(this.results.length)
        return this.roundIndex % 2 === 0
            ? this.results.get(cardIndex).elementRef.nativeElement.offsetLeft
            : this.results.get(cardIndex).elementRef.nativeElement.offsetLeft + 250;
    }

}
