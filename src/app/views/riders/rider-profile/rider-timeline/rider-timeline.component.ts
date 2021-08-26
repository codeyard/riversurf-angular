import { Component, OnInit } from '@angular/core';
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
export class RiderTimelineComponent implements OnInit {

    currentTimeline : TimelineItem[] = [...DefaultTimelineItemsWinning];
    oldTimeLine : TimelineItem[] = [...DefaultTimelineItemsLoosing];

  constructor() { }

  ngOnInit(): void {
  }

}
