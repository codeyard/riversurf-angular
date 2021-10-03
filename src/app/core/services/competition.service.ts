import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Competition} from "../models/competition.model";
import {BehaviorSubject, from, Observable, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "./app-config.service";
import {filter, map} from "rxjs/operators";
import {NetworkStatusService} from "./network-status.service";
import {DexieService} from "./dexie.service";
import {SnackbarService} from "./snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class CompetitionService implements OnInit, OnDestroy {

    PROTOCOL_HTTPS = 'https://';
    PATH_ENDPOINT = '/api/competitions';
    isOffline: boolean = false;
    networkStatusSubscription!: Subscription;
    dexieDB: any;
    private competitionData = new BehaviorSubject<Competition[]>([])
    private competition$ = this.competitionData.asObservable();

    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
        private networkStatusService: NetworkStatusService,
        private dexieService: DexieService,
        private snackBarService: SnackbarService) {

        this.fetchAllCompetitions();
        this.dexieDB = dexieService.getDB();
        this.dexieDB.competitions.toArray().then((competitions: Competition[]) => {
            this.competitionData.next(competitions);
        })
        this.networkStatusSubscription = this.networkStatusService.getNetworkStatus()
            .subscribe(
                (status) => {
                    this.isOffline = status === 'OFFLINE';
                    if (!this.isOffline) {
                        this.dexieDB.competitions.toArray().then((competitions: Competition[]) => {
                            if (competitions.length > 0) {
                                competitions.forEach(competition => {
                                    this.pushToServer(competition).subscribe(
                                        () => {
                                            this.dexieDB.competitions.delete(competition.id).then(() =>
                                                this.snackBarService.send("Welcome Back Online. All results were saved on the server!", "success")
                                            )
                                        },
                                        () => this.snackBarService.send("We could not save your updates on the server! Please submit them again while you are online.", "error")
                                    )
                                });
                            }
                        })
                    }
                }
            )
    }


    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.networkStatusSubscription.unsubscribe();
    }

    getCompetitionsByIds(ids: string[]): Observable<Competition[]> {
        return this.competition$
            .pipe(
                filter(competitions => competitions.length > 0),
                map(competitions => {
                    if (competitions.filter(competition => ids.includes(competition.id)) !== undefined) {
                        return competitions.filter(competition => ids.includes(competition.id))
                    } else {
                        throw ("NOT_EXISTS");
                    }
                })
            )
    }

    updateCompetition(competition: Competition): Observable<any> {
        if (this.isOffline) {
            return from(this.dexieDB.competitions.put(competition));
        } else {
            return this.pushToServer(competition);
        }
    }

    pushToServer(competition: Competition) {
        const requestUrl = this.PROTOCOL_HTTPS + this.appConfigService.getHostName() + this.PATH_ENDPOINT + `/${competition.id}`;
        return this.httpClient.put(requestUrl, competition)
    }

    calculateMinimumHeats(riders: number, heatSize ?: number) {
        const ridersInHeat = heatSize ? heatSize > 0 ? heatSize : 4 : 4;
        let minimumHeats = Math.floor(riders / ridersInHeat);
        if (riders % ridersInHeat != 0) {
            minimumHeats++;
        }
        return minimumHeats;
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

}
