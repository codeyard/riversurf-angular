import {Component, Input, OnInit} from '@angular/core';
import {TimeLineItem, TimeLineItemIcon} from "./timeline-item.model";

@Component({
    selector: 'rs-time-line',
    templateUrl: './time-line.component.html',
    styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit {

    @Input() timeline: TimeLineItem[] = [];
    @Input() ongoing: boolean = false;

    constructor() {
    }

    ngOnInit(): void {
    }

    getIconForTimeline(iconName: TimeLineItemIcon) {
        switch (iconName) {
            case "default":
            default:
                return "";

            case "start":
                return "tour";

            case "finish":
                return "sports_score";

            case "win":
                return "sentiment_very_satisfied";

            case "lose":
                return "sentiment_very_dissatisfied";
        }
    }
}
