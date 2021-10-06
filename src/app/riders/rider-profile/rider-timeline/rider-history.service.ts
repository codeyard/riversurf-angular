import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {EventTimeLine} from "./time-line/event-timeline.model";
import {distinctUntilChanged, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "../../../core/services/app-config.service";
import {WebSocketService} from "../../../core/services/web-socket.service";

@Injectable({
    providedIn: 'root'
})
export class RiderHistoryService {

    RIDER_PAT = "/api/riders/";
    EVENTTIMELINE_ENDPOINT = "/eventtimeline"
    private eventTimeLineData: EventTimeLine[] = [];
    private eventTimeLines = new Subject<EventTimeLine[]>();
    private eventTimeLines$ = this.eventTimeLines.asObservable();

    constructor(
        private appConfigService: AppConfigService,
        private httpClient: HttpClient,
        private webSocketService: WebSocketService
    ) {
        this.webSocketService.getUpdatedAboutTopic("eventtimeline").subscribe(eventtimeline => {
            this.updateTimeLine(eventtimeline);
        });
    }

    getRiderTimeLines(id: string): Observable<EventTimeLine[]> {
        let requestUrl = this.appConfigService.getProtocol() + this.appConfigService.getHostName() + this.RIDER_PAT + id + this.EVENTTIMELINE_ENDPOINT;
        this.httpClient.get<EventTimeLine[]>(requestUrl).subscribe(
            (responseData: EventTimeLine[]) => {
                this.eventTimeLineData = responseData;
                this.eventTimeLineData.forEach(eventTimeLine => {
                    eventTimeLine.ongoing = new Date(eventTimeLine.timeline[0].time).toDateString() === new Date().toDateString();
                });
                this.eventTimeLines.next(this.eventTimeLineData);
            },
            error => {
                console.log('ERROR loading competitions data :-(', error)
            }
        )


        return this.eventTimeLines$.pipe(
            map(eventTimeLines => eventTimeLines.filter(eventTimeLine => eventTimeLine.riderId === id)),
            // filter for if any of riders timelines has changed reference
            distinctUntilChanged((prevTimeLines, nextTimelines) => {
                return prevTimeLines.length === nextTimelines.length &&
                    prevTimeLines.every(timeline => nextTimelines.includes(timeline));
            })
        );

    }

    private updateTimeLine(updatedTimeLine: EventTimeLine) {
        const index = this.eventTimeLineData.findIndex(item => item.id === updatedTimeLine.id);
        if (index != -1) {
            this.eventTimeLineData[index] = updatedTimeLine;
        } else {
            this.eventTimeLineData.push(updatedTimeLine);
        }
        this.eventTimeLineData.forEach(eventTimeLine => {
            eventTimeLine.ongoing = new Date(eventTimeLine.timeline[0].time).toDateString() === new Date().toDateString();
        });
        this.eventTimeLines.next(this.eventTimeLineData);
    }
}
