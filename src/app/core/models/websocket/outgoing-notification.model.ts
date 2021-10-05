import {Division} from "../division.type";
import {Result} from "../competition.model";

export interface OutgoingNotification {
    surfEvent: string;
    surfEventName: string;
    division: Division,
    round: number,
    heat: number,
    topic : string;
    action: string;
    timestamp: string;
    riders: string[];
    results: Result[];
    link: string;
}

