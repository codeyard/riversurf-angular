import {Component, Input, OnInit} from '@angular/core';
import {DefaultTimelineItem, TimelineItem} from "./timeline-item.model";

@Component({
  selector: 'surf-timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrls: ['./timeline-item.component.scss']
})
export class TimelineItemComponent implements OnInit {

    @Input() item: TimelineItem = {...DefaultTimelineItem};

    constructor() {
    }

    ngOnInit(): void {
    }

}
