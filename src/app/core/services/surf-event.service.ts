import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {SurfEvent} from "../models/surf-event.model";
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {map, switchMap} from "rxjs/operators";
import {Division} from "../models/division.type";
import {CompetitionService} from "./competition.service";
import {Competition} from "../models/competition.model";

@Injectable({
    providedIn: 'root'
})
export class SurfEventService {

    PROTOCOL_HTTPS = 'https://';
    PATH_ENDPOINT = '/api/surfevents';

    private surfEvents = new BehaviorSubject<SurfEvent[]>([]);
    private surfEvents$ = this.surfEvents.asObservable();

    constructor(private httpClient: HttpClient, private appConfigService: AppConfigService, private competitionService: CompetitionService) {
    }

    getSurfEvent(id: string): Observable<SurfEvent> {
        return this.getSurfEvents().pipe(
            map(surfEvents => surfEvents.filter(surfEvent => surfEvent.id === id)[0])
        );
    }

    getSurfEvents(): Observable<SurfEvent[]> {
        if(this.surfEvents.getValue().length <= 0) {
            this.fetchAllSurfEvents();
        }
        return this.surfEvents$;
    }

    getCompetitionByDivision(id: string, division : Division){
        return this.getSurfEvent(id).pipe(
            switchMap((surfEvent : SurfEvent) => this.competitionService.getCompetitionsByIds(surfEvent.competitions)),
            map((competitions : Competition[])=>competitions.filter(competition=>competition.division === division)[0])
        );
    }

    private fetchAllSurfEvents() {
        const requestUrl = this.PROTOCOL_HTTPS + this.appConfigService.getHostName() + this.PATH_ENDPOINT;
        this.httpClient.get<SurfEvent[]>(requestUrl).subscribe(
            (responseData: SurfEvent[]) => this.surfEvents.next(responseData),
            error => {
                console.log('ERROR loading surfEvent data :-(', error)
            }
        )
    }
}
