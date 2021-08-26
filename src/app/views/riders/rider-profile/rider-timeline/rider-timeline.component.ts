import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
    DefaultTimeLineItemsLoosing,
    DefaultTimeLineItemsWinning,
    TimeLineItem
} from "../../../../models/timeline-item.model";
import {
    EventTimeline,
    GenerateEventTimeLine,
    GenerateHistoryEventTimeLine
} from "../../../../models/event-timeline.model";

@Component({
    selector: 'surf-rider-timeline',
    templateUrl: './rider-timeline.component.html',
    styleUrls: ['./rider-timeline.component.scss']
})
export class RiderTimelineComponent implements OnInit, OnChanges {

    currentTimeline ?: EventTimeline;
    historyTimeline ?: EventTimeline[];

    @Input() riderId ?: string;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.riderId.currentValue != changes.riderId.previousValue && changes.riderId.currentValue != undefined) {

            // ToDo: Load timeline items from service
            this.currentTimeline = GenerateEventTimeLine(2021, this.riderId || '');
            this.historyTimeline = GenerateHistoryEventTimeLine(2021, 3, this.riderId || '');
        }
    }
}
