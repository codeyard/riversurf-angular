import {Injectable} from '@angular/core';
import {Competition, exampleComp} from "../models/competition.model";
import {BehaviorSubject, Observable} from "rxjs";
import {filter, map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CompetitionService {

    private competitionData = new BehaviorSubject<Competition[]>([])
    private competition$ = this.competitionData.asObservable();

    constructor() {
        this.fetchCompetitions();
    }

    private fetchCompetitions() {

        let competitions = [{...exampleComp}];

        competitions.forEach(competition => CompetitionService.setupRounds(competition));

        this.competitionData.next(competitions);
    }

    private static setupRounds(competition: Competition) {

        let calculatedRounds = CompetitionService.calculateMinimumRounds(competition.riders.length, competition.config.maxRidersInHeat, competition.config.winnersInHeat);

        if(competition.rounds.length < calculatedRounds) {
            for (let i = competition.rounds.length; i < calculatedRounds; i++) {
                competition.rounds.push({
                    id: i + 1,
                    riders: i === 0 ? competition.riders : [],
                    heats: []
                });
            }
        }
    }

    private static calculateMinimumRounds(riders : number, heatSize? : number, heatWinners? : number){
        const ridersInHeat = heatSize ? heatSize > 0 ? heatSize : 4 : 4;
        const regularWinnersInHeat = heatWinners ? heatWinners > 0 && heatWinners <= ridersInHeat ? heatWinners : 2 : 2;

        let calculatedRounds = 0;
        let winners = riders;

        do {
            let minimumHeatsInRound = this.calculateMinimumHeats(winners, ridersInHeat);
            winners = minimumHeatsInRound * regularWinnersInHeat;
            calculatedRounds++;
        }while(winners >= ridersInHeat)
        return calculatedRounds;
    }

    static calculateMinimumHeats(riders: number, heatSize ?: number){
        const ridersInHeat = heatSize ? heatSize > 0 ? heatSize : 4 : 4;
        let minimumHeats = Math.floor(riders / ridersInHeat);
        if (riders % ridersInHeat != 0) {
            minimumHeats++;
        }
        return minimumHeats;
    }

    getCompetitionsByIds(ids: string[]): Observable<Competition[]> {
        return this.competition$
            .pipe(
                filter(competitions => competitions.length > 0),
                map(competitions => competitions.filter(competition => ids.includes(competition.id)))
            )
    }
}
