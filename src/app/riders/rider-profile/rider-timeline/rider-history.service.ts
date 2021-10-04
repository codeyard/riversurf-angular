import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {EventTimeLine} from "./time-line/event-timeline.model";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Competition} from "../../../core/models/competition.model";
import {AppConfigService} from "../../../core/services/app-config.service";

@Injectable({
    providedIn: 'root'
})
export class RiderHistoryService {

    RIDER_PAT = "/api/riders/";
    EVENTTIMELINE_ENDPOINT = "/eventtimeline"

    private eventTimeLines = new BehaviorSubject<EventTimeLine[]>([]);
    private eventTimeLines$ = this.eventTimeLines.asObservable();

    constructor(
        private appConfigService: AppConfigService,
        private httpClient: HttpClient
    ) {
        // ToDo: load initial data over api for data and subscribe to websocket for updates (only the currently ongoing timelines will be pushed over websocket)

        //this.updateTimeLines(/* put received event timelines here */);
    }

    getRiderTimeLines(id: string): Observable<EventTimeLine[]> {
        if (this.eventTimeLines.value.every(eventTimeLine => eventTimeLine.riderId !== id)) {
            let requestUrl = this.appConfigService.getProtocol() + this.appConfigService.getHostName() + this.RIDER_PAT + id + this.EVENTTIMELINE_ENDPOINT;
            this.httpClient.get<EventTimeLine[]>(requestUrl).subscribe(
                (responseData: EventTimeLine[]) => {
                    const allEventTimeLines = [...this.eventTimeLines.getValue()];
                    allEventTimeLines.push(...responseData);
                    allEventTimeLines.forEach(eventTimeLine => {
                        const isongoing = new Date(eventTimeLine.timeline[0].time).toDateString() === new Date().toDateString();
                        eventTimeLine.ongoing = isongoing;
                    });
                    this.eventTimeLines.next(allEventTimeLines);
                },
                error => {
                    console.log('ERROR loading competitions data :-(', error)
                }
            )
        }

        return this.eventTimeLines$.pipe(
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
