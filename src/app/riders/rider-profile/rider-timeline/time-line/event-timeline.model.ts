import {TimeLineItem} from "./timeline-item.model";
import {SurfEvent} from "../../../../core/models/surf-event.model";

export interface EventTimeLine {
    id: string;
    event: SurfEvent;
    ongoing: boolean;
    riderId: string;
    timeline: TimeLineItem[];
}

export interface EventTimeLineCollection{
    year: number;
    timeLines: EventTimeLine[];
}
