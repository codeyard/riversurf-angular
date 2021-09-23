import {
    DefaultTimeLineItemsLosing,
    DefaultTimeLineItemsOngoing,
    DefaultTimeLineItemsWinning,
    TimeLineItem
} from "./timeline-item.model";
import {SurfEvent, exampleEvent} from "../../../../core/models/surf-event.model";

export interface EventTimeLine {
    event : SurfEvent;
    riderId : string;
    timeline : TimeLineItem[];
}

export function GenerateEventTimeLine(year : number, riderId : string, ongoing : boolean) : EventTimeLine {

    let timeline : TimeLineItem[] = [];

    // TODO: Change to real data

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

export function GenerateHistoryEventTimeLine(startingYear : number, years : number, riderId : string) : EventTimeLine[] {
    let timeline : EventTimeLine[] = [];

    for(let history = startingYear; history > (startingYear - years); history--){
        timeline.push(GenerateEventTimeLine(history, riderId, false));
    }

    return timeline;
}
