import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
    DefaultTimelineItemsLoosing,
    DefaultTimelineItemsWinning,
    TimelineItem
} from "../../../../common/timeline/timeline-item.model";

@Component({
    selector: 'surf-rider-timeline',
    templateUrl: './rider-timeline.component.html',
    styleUrls: ['./rider-timeline.component.scss']
})
export class RiderTimelineComponent implements OnInit, OnChanges {

    currentTimeline: TimelineItem[] = [];
    oldTimeLine: TimelineItem[] = [];

    @Input() riderId ?: string;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.riderId.currentValue != changes.riderId.previousValue && changes.riderId.currentValue != undefined) {

            // ToDo: Load timeline items from service
            this.currentTimeline = [...DefaultTimelineItemsWinning];
            this.oldTimeLine = [...DefaultTimelineItemsLoosing];
        }
    }
}
