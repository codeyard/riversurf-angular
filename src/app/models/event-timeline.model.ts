import {DefaultTimeLineItemsLoosing, DefaultTimeLineItemsWinning, TimeLineItem} from "./timeline-item.model";
import {Event, exampleEvent} from "./event.model";

export interface EventTimeline {
    event : Event;
    riderId : string;
    timeline : TimeLineItem[];
}

export function GenerateEventTimeLine(year : number, riderId : string) : EventTimeline {

    let timeline : TimeLineItem[] = [];

    if(year === 2021){
        timeline = [...DefaultTimeLineItemsWinning];
    } else {
        timeline = [...DefaultTimeLineItemsLoosing];
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
        timeline.push(GenerateEventTimeLine(history, riderId));
    }

    return timeline;
}
