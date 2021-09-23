import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {EventTimeLine} from "./time-line/event-timeline.model";
import {map} from "rxjs/operators";
import {
    DefaultTimeLineItemsLosing,
    DefaultTimeLineItemsOngoing,
    DefaultTimeLineItemsWinning
} from "./time-line/timeline-item.model";
import {exampleEvent} from "../../../core/models/surf-event.model";

@Injectable({
    providedIn: 'root'
})
export class RiderHistoryService {

    private eventTimeLines = new BehaviorSubject<EventTimeLine[]>([]);

    constructor() {
        // ToDo: load initial data over api for data and subscribe to websocket for updates (only the currently ongoing timelines will be pushed over websocket)
        this.updateTimeLines(this.generateCurrentEventTimeLines());
    }

    getRiderTimeLines(id: string): Observable<EventTimeLine[]> {
        if (this.eventTimeLines.value.every(eventTimeLine => eventTimeLine.riderId !== id)) {
            // ToDo: get eventtimelines of rider and call updateTimeLines() with the returned array
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

    // ToDo: Remove when api interface available
    private generateCurrentEventTimeLines(): EventTimeLine[] {
        const eventTimeLines: EventTimeLine[] = [];
        const riders = [
            "6132710cfc13ae15b3000001", // pierette baltrushaitis -> has two ongoing timelines
            "6132710cfc13ae15b3000002", // katerina humphries -> toggle on = two historical timelines
            "6132710cfc13ae15b3000003",
            "6132710cfc13ae15b3000004",
            "6132710cfc13ae15b3000005",
            "6132710cfc13ae15b3000006",
            "6132710cfc13ae15b3000007",
            "6132710cfc13ae15b3000008",
            "6132710cfc13ae15b3000009", // patrizia manna -> toggle off = only one historical timeline
            "6132710cfc13ae15b300000a",
            "6132710cfc13ae15b300000b",
            "6132710cfc13ae15b300000c",
            "6132710cfc13ae15b300000d",
            "6132710cfc13ae15b300000e",
            "6132710cfc13ae15b300000f"
        ];

        let toggle = false;
        let first = false;

        for (const rider of riders) {
            eventTimeLines.push({
                id: Math.random().toString(),
                event: {...exampleEvent},
                ongoing: true,
                riderId: rider,
                timeline: [...DefaultTimeLineItemsOngoing]
            });
            if(!first){
                first = true;
                eventTimeLines.push({
                    id: Math.random().toString(),
                    event: {...exampleEvent},
                    ongoing: true,
                    riderId: rider,
                    timeline: [...DefaultTimeLineItemsOngoing]
                });
            }
            eventTimeLines.push({
                id: Math.random().toString(),
                event: {
                    ...exampleEvent,
                    startDateTime: new Date(2020, 1, 12, 0, 0, 0, 0),
                    id: 'riversurf-jam-thun-2020',
                    location: 'Thun'
                },
                ongoing: false,
                riderId: rider,
                timeline: [...DefaultTimeLineItemsLosing]
            });
            if (toggle) {
                eventTimeLines.push({
                    id: Math.random().toString(),
                    event: {
                        ...exampleEvent,
                        startDateTime: new Date(2020, 9, 31, 0, 0, 0, 0),
                        id: 'riversurf-jam-halloween-2020',
                        location: 'Schwarzenburg'
                    },
                    ongoing: false,
                    riderId: rider,
                    timeline: [...DefaultTimeLineItemsWinning]
                });
            }
            toggle = !toggle;
        }
        return eventTimeLines;
    }
}
