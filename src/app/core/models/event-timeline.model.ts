import {
    DefaultTimeLineItemsLosing,
    DefaultTimeLineItemsOngoing,
    DefaultTimeLineItemsWinning,
    TimeLineItem
} from "./timeline-item.model";
import {SurfEvent, exampleEvent} from "./surf-event.model";

export interface EventTimeline {
    event : SurfEvent;
    riderId : string;
    timeline : TimeLineItem[];
}

export function GenerateEventTimeLine(year : number, riderId : string, ongoing : boolean) : EventTimeline {

    let timeline : TimeLineItem[] = [];

    if(ongoing){
        timeline = [...DefaultTimeLineItemsOngoing];
    } else {
        if (year === 2021) {
            timeline = [...DefaultTimeLineItemsWinning];
        } else {
            timeline = [...DefaultTimeLineItemsLosing];
        }
    }

    return {
        event : {...exampleEvent,
            id: "riversurf-jam-thun-" + year,
            startDateTime: new Date(year, 1, 1),
            endDateTime: new Date(year, 1, 1)},
        riderId : riderId,
        timeline : timeline
    }
}

export function GenerateHistoryEventTimeLine(startingYear : number, years : number, riderId : string) : EventTimeline[] {
    let timeline : EventTimeline[] = [];

    for(let history = startingYear; history > (startingYear - years); history--){
        timeline.push(GenerateEventTimeLine(history, riderId, false));
    }

    return timeline;
}
