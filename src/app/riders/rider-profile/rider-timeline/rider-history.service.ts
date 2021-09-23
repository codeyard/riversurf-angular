import {Injectable} from '@angular/core';
import {RidersModule} from "../../riders.module";
import {BehaviorSubject, Observable} from "rxjs";
import {EventTimeLine} from "./time-line/event-timeline.model";
import {map} from "rxjs/operators";
import {DefaultTimeLineItemsOngoing} from "./time-line/timeline-item.model";
import {exampleEvent} from "../../../core/models/surf-event.model";

@Injectable({
    providedIn: RidersModule
})
export class RiderHistoryService {

    // ToDo: Load initial data from rest and subscribe to websocket for updates (currently running events)

    private eventTimeLines = new BehaviorSubject<EventTimeLine[]>([]);

    constructor() {
        // ToDo: load initial data for currentRiderEvents
        this.updateTimeLines(this.generateCurrentEventTimeLines());
    }

    getRiderTimeLines(id: string): Observable<EventTimeLine[]> {
        if (this.eventTimeLines.value.every(eventTimeLine => eventTimeLine.riderId !== id)) {
            // ToDo: get eventtimeline of rider and call updateTimeLines() with the returned array
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

    private generateCurrentEventTimeLines(): EventTimeLine[] {
        const eventTimeLines: EventTimeLine[] = [];
        const riders = [
            "6132710cfc13ae15b3000001",
            "6132710cfc13ae15b3000002",
            "6132710cfc13ae15b3000003",
            "6132710cfc13ae15b3000004",
            "6132710cfc13ae15b3000005",
            "6132710cfc13ae15b3000006",
            "6132710cfc13ae15b3000007",
            "6132710cfc13ae15b3000008",
            "6132710cfc13ae15b3000009",
            "6132710cfc13ae15b300000a",
            "6132710cfc13ae15b300000b",
            "6132710cfc13ae15b300000c",
            "6132710cfc13ae15b300000d",
            "6132710cfc13ae15b300000e",
            "6132710cfc13ae15b300000f"
        ];

        for (const rider of riders) {
            eventTimeLines.push({
                id: Math.random().toString(),
                event: {...exampleEvent},
                ongoing: true,
                riderId: rider,
                timeline: [...DefaultTimeLineItemsOngoing]
            });
        }

        return eventTimeLines;
    }
}
