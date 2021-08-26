import {
    AfterViewInit,
    Component,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {DefaultTimelineItemsWinning, TimelineItem, TimelineItemIcon} from "./timeline-item.model";
import {MatStepper} from "@angular/material/stepper";

@Component({
  selector: 'surf-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit {

    @Input() timeline: TimelineItem[] = [];

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

    getIconForTimeline(iconName : TimelineItemIcon){
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
