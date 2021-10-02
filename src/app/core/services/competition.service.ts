import {Injectable} from '@angular/core';
import {Competition} from "../models/competition.model";
import {BehaviorSubject, from, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {filter, map, tap} from "rxjs/operators";
import {NetworkStatusService} from "./network-status.service";
import {DexieService} from "./dexie.service";

@Injectable({
    providedIn: 'root'
})
export class CompetitionService {

    PROTOCOL_HTTPS = 'https://';
    PATH_ENDPOINT = '/api/competitions';

    private competitionData = new BehaviorSubject<Competition[]>([])
    private competition$ = this.competitionData.asObservable();

    dexieDB: any;

    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
        private networkStatusService: NetworkStatusService,
        private dexieService: DexieService) {
        this.fetchAllCompetitions();
        this.dexieDB = dexieService.getDB();
        this.dexieDB.competitions.toArray().then((competitions: Competition[]) => {
            this.competitionData.next(competitions);
        })
    }

    getCompetitionsByIds(ids: string[]): Observable<Competition[]> {
        return this.competition$
            .pipe(
                filter(competitions => competitions.length > 0),
                map(competitions => {
                    if(competitions.filter(competition => ids.includes(competition.id)) !== undefined) {
                    return competitions.filter(competition => ids.includes(competition.id))
                    } else {
                        throw ("NOT_EXISTS");
                    }
                })
            )
    }

    updateCompetition(competition: Competition, isOffline: boolean): Observable<any> {
        if (isOffline) {
            return from(this.dexieDB.competitions.put(competition));
        } else {
            const requestUrl = this.PROTOCOL_HTTPS + this.appConfigService.getHostName() + this.PATH_ENDPOINT + `/${competition.id}`;
            return this.httpClient.put(requestUrl, competition)
        }
    }

    private fetchAllCompetitions() {
        const requestUrl = this.PROTOCOL_HTTPS + this.appConfigService.getHostName() + this.PATH_ENDPOINT;
        this.httpClient.get<Competition[]>(requestUrl).subscribe(
            (responseData: Competition[]) => {
                responseData.forEach(competition => this.setupRounds(competition));
                this.competitionData.next(responseData)
            },
            error => {
                console.log('ERROR loading competitions data :-(', error)
            }
        )
    }

    private setupRounds(competition: Competition) {
        let calculatedRounds = this.calculateMinimumRounds(competition.riders.length, competition.config.maxRidersInHeat, competition.config.winnersInHeat);

        if (competition.rounds.length < calculatedRounds) {
            for (let i = competition.rounds.length; i < calculatedRounds; i++) {
                competition.rounds.push({
                    id: i,
                    riders: i === 0 ? competition.riders : [],
                    heats: []
                });
            }
        }
    }

    private calculateMinimumRounds(riders: number, heatSize?: number, heatWinners?: number) {
        const ridersInHeat = heatSize ? heatSize > 0 ? heatSize : 4 : 4;
        const regularWinnersInHeat = heatWinners ? heatWinners > 0 && heatWinners <= ridersInHeat ? heatWinners : 2 : 2;

        let calculatedRounds = 1; // seeding-round
        let winners = riders;

        do {
            let minimumHeatsInRound = this.calculateMinimumHeats(winners, ridersInHeat);
            winners = minimumHeatsInRound * regularWinnersInHeat;
            calculatedRounds++;
        } while (winners >= ridersInHeat)
        return calculatedRounds;
    }

    calculateMinimumHeats(riders: number, heatSize ?: number) {
        const ridersInHeat = heatSize ? heatSize > 0 ? heatSize : 4 : 4;
        let minimumHeats = Math.floor(riders / ridersInHeat);
        if (riders % ridersInHeat != 0) {
            minimumHeats++;
        }
        return minimumHeats;
    }
}
