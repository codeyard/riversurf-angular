import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {SurfEvent} from "../models/surf-event.model";
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {distinctUntilChanged, filter, map, switchMap, tap} from "rxjs/operators";
import {Division} from "../models/division.type";
import {CompetitionService} from "./competition.service";
import {Competition} from "../models/competition.model";
import {RidersService} from "./riders.service";
import {Rider} from "../models/rider.model";
import {SnackbarService} from "./snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class SurfEventService {

    PATH_ENDPOINT = '/api/surfevents';

    private surfEventsData = new BehaviorSubject<SurfEvent[]>([]);
    private surfEvents$ = this.surfEventsData.asObservable();

    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
        private competitionService: CompetitionService,
        private ridersService: RidersService,
        private snackBarService: SnackbarService) {
    }

    getSurfEvent(id: string): Observable<SurfEvent> {
        return this.getSurfEvents().pipe(
            filter(surfEvents => surfEvents.length > 0),
            map(surfEvents => {
                const surfEvent = surfEvents.filter(surfEvent => surfEvent.id === id)[0];
                if (surfEvent !== undefined) {
                    return surfEvent;
                } else {
                    throw "NOT_EXISTS";
                }
            }),
        );
    }

    getCurrentSurfEvents(): Observable<SurfEvent[]> {
        return this.getSurfEvents().pipe(
            map(surfEvents => surfEvents.filter(surfEvent => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const startDate: Date = new Date(surfEvent.startDateTime);
                startDate.setHours(0, 0, 0, 0);
                startDate.setDate(startDate.getDate() - 1);
                const endDate = new Date(surfEvent.endDateTime);
                endDate.setHours(0, 0, 0, 0);
                endDate.setDate(endDate.getDate() + 1);
                return startDate <= today && today <= endDate;
            })),
            map(results => {
                return results.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
            }),
            tap(currentSurfEvents => {
                for(const currentSurfEvent of currentSurfEvents){
                    this.competitionService.getCompetitionsByIds(currentSurfEvent.competitions).subscribe();
                }
            })
        );
    }

    getUpcomingSurfEvents(): Observable<SurfEvent[]> {
        return this.getSurfEvents().pipe(
            map(surfEvents => surfEvents.filter(surfEvent => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const startDate: Date = new Date(surfEvent.startDateTime);
                startDate.setHours(0, 0, 0, 0);
                return today < startDate;
            })),
            map(results => {
                return results.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
            })
        );
    }

    getPastSurfEvents(): Observable<SurfEvent[]> {
        return this.getSurfEvents().pipe(
            map(surfEvents => surfEvents.filter(surfEvent => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const endDate = new Date(surfEvent.endDateTime);
                endDate.setHours(0, 0, 0, 0);
                return endDate < today;
            })),
            map(results => {
                return results.sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())
            })
        );
    }

    getSurfEvents(): Observable<SurfEvent[]> {
        if (this.surfEventsData.getValue().length <= 0) {
            this.fetchAllSurfEvents();
        }
        return this.surfEvents$;
    }

    getEnrolledRiders(id: string): Observable<Rider[]> {
        return this.getSurfEvent(id).pipe(
            filter(surfEvent => surfEvent !== undefined),
            switchMap((surfEvent: SurfEvent) => this.competitionService.getCompetitionsByIds(surfEvent.competitions)),
            filter(competitions => competitions !== undefined && competitions.length > 0),
            switchMap((competitions: Competition[]) => {
                    const riderIds: string[] = [];
                    competitions.forEach(competition => {
                        riderIds.push(...competition.riders)
                    });
                    return this.ridersService.getRidersByIds(riderIds)
                }
            )
        )
    }

    getCompetitionByDivision(id: string, division: Division) {
        return this.getSurfEvent(id).pipe(
            filter(surfEvent => surfEvent !== undefined),
            switchMap((surfEvent: SurfEvent) => this.competitionService.getCompetitionsByIds(surfEvent.competitions)),
            filter(competitions => competitions !== undefined && competitions.length > 0),
            map((competitions: Competition[]) => {
                const competition = competitions.filter(competition => competition.division === division)[0];
                if(competition !== undefined){
                    return competition;
                } else {
                    throw "NON_EXISTING_COMPETITION";
                }
            }),
            distinctUntilChanged((prevComp, nextComp) => prevComp.id === nextComp.id && prevComp.version === nextComp.version)
            );
    }

    updateCompetition(competition: Competition) {
        return this.competitionService.updateCompetition(competition);
    }

    private fetchAllSurfEvents() {
        const requestUrl = this.appConfigService.getProtocol() + this.appConfigService.getHostName() + this.PATH_ENDPOINT;
        this.httpClient.get<SurfEvent[]>(requestUrl).subscribe(
            (responseData: SurfEvent[]) => this.surfEventsData.next(responseData),
            error => {
                this.snackBarService.send("We couldn't load the latest jam data. Please try again", "error");
                console.log('ERROR loading surfEvent data :-(', error)
            }
        )
    }

    getCompetitionUpdates() {
        return this.competitionService.competition;
    }
}
