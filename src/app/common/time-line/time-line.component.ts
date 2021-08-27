import {
    AfterViewInit,
    Component,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {TimeLineItem, TimeLineItemIcon} from "../../models/timeline-item.model";
import {MatStepper} from "@angular/material/stepper";

@Component({
    selector: 'surf-time-line',
    templateUrl: './time-line.component.html',
    styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit {

    @Input() timeline: TimeLineItem[] = [];
    @Input() ongoing : boolean = false;

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
                return "play_arrow";

            case "finish":
                return "stop";

            case "win":
                return "flare";

            case "loose":
                return "flash_on";
        }
    }
}
