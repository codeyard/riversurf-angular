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
    selector: 'surf-timeline',
    templateUrl: './time-line.component.html',
    styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit, AfterViewInit {

    @Input() timeline: TimeLineItem[] = [];

    private animationStepDuration = 200;

    @ViewChild('stepper') stepper !: MatStepper;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.animateTimeline(), this.animationStepDuration);
    }

    private animateTimeline() {
        if (this.stepper.selectedIndex < this.stepper.steps.length - 1) {
            this.stepper.next();
            setTimeout(() => this.animateTimeline(), this.animationStepDuration);
        }
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
