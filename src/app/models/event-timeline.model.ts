import {DefaultTimelineItemsLoosing, DefaultTimelineItemsWinning, TimelineItem} from "./timeline-item.model";
import {Event, exampleEvent} from "./event.model";

export interface EventTimeline {
    event : Event;
    riderId : string;
    timeline : TimelineItem[];
}

export function GenerateEventTimeLine(year : number, riderId : string) : EventTimeline {

    let timeline : TimelineItem[] = [];

    if(year === 2021){
        timeline = [...DefaultTimelineItemsWinning];
    } else {
        timeline = [...DefaultTimelineItemsLoosing];
    }

    return {
        event : {...exampleEvent,
            id: "riversurf-jam-thun-" + year,
            startDateTime: new Date(year),
            endDateTime: new Date(year)},
        riderId : riderId,
        timeline : timeline
    }
}
