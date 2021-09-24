import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {EventTimeLine} from "./time-line/event-timeline.model";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class RiderHistoryService {

    private eventTimeLines = new BehaviorSubject<EventTimeLine[]>([]);

    constructor() {
        // ToDo: load initial data over api for data and subscribe to websocket for updates (only the currently ongoing timelines will be pushed over websocket)
        //this.updateTimeLines(/* put received event timelines here */);
    }

    getRiderTimeLines(id: string): Observable<EventTimeLine[]> {
        if (this.eventTimeLines.value.every(eventTimeLine => eventTimeLine.riderId !== id)) {
            // ToDo: get eventtimelines of rider and call updateTimeLines() with the returned array
            //this.updateTimeLines(/* put fetched event timelines here */);
        }

        return this.eventTimeLines.asObservable().pipe(
            map(eventTimeLines => eventTimeLines.filter(eventTimeLine => eventTimeLine.riderId === id))
        );
    }

    private updateTimeLines(updatedTimeLines: EventTimeLine[]) {
        const currentEventTimeLines = this.eventTimeLines.value;
        for (const updatedTimeLine of updatedTimeLines) {
            const index = currentEventTimeLines.findIndex(item => item.id === updatedTimeLine.id);
            if (index != -1) {
                currentEventTimeLines[index] = updatedTimeLine;
            } else {
                currentEventTimeLines.push(updatedTimeLine);
            }
        }
        this.eventTimeLines.next(currentEventTimeLines);
    }
}
