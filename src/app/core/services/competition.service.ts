import {Injectable} from '@angular/core';
import {Competition, exampleComp, Round} from "../models/competition.model";
import {BehaviorSubject, Observable} from "rxjs";
import {filter, map, tap} from "rxjs/operators";

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

        competitions.forEach(competition => this.setupRounds(competition));

        this.competitionData.next(competitions);
    }

    private setupRounds(competition: Competition) {
        let initialRound: Round = {
            id: 0,
            riders: competition.riders,
            heats: []
        }
        competition.rounds.push(initialRound);
        const maxRounds = Math.floor(competition.riders.length / 4);
        for (let i = 0; i < maxRounds; i++) {
            competition.rounds.push({
                id: i + 1,
                riders: [],
                heats: []
            });
        }
    }

    getCompetitionsByIds(ids: string[]): Observable<Competition[]> {
        return this.competition$
            .pipe(
                tap((e)=> console.log(`Competitions`, e)),
                filter(competitions => competitions.length > 0),
                tap((e)=> console.log(`Filtered`, e)),
                map(competitions => competitions.filter(competition => ids.includes(competition.id)))
            )
    }
}
