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

    private currentRiderEvents = new BehaviorSubject<EventTimeLine[]>([]);

    private historicalRiderEventsData: EventTimeLine[] = [];
    private historicalRiderEvents = new BehaviorSubject<EventTimeLine[]>(this.historicalRiderEventsData);

    constructor() {
        // ToDo: load initial data for currentRiderEvents
        this.currentRiderEvents.next(this.generateCurrentEventTimeLines())
    }

    getCurrentRiderEvents(id: string): Observable<EventTimeLine[]> {
        return this.currentRiderEvents.asObservable().pipe(
            map(eventTimeLines => eventTimeLines.filter(eventTimeLine => eventTimeLine.riderId === id))
        );
    }

    getHistoricalRiderEvents(id: string): Observable<EventTimeLine[]> {
        if (this.historicalRiderEventsData.every(eventTimeLine => eventTimeLine.riderId !== id)) {
            // asked riderid is not in already fetched data

            // ToDo: load historical rider events of rider
        }

        return this.historicalRiderEvents.asObservable().pipe(
            map(eventTimeLines => eventTimeLines.filter(eventTimeLine => eventTimeLine.riderId === id))
        );
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
                event: {...exampleEvent},
                riderId: rider,
                timeline: [...DefaultTimeLineItemsOngoing]
            });
        }

        return eventTimeLines;
    }
}
