import {Component, OnInit} from '@angular/core';
import {Competition, exampleComp} from "../../../core/models/competition.model";

export interface RoundModel {
    id: number;
    riders: string[];
}

@Component({
    selector: 'rs-competition',
    templateUrl: './competition.component.html',
    styleUrls: ['./competition.component.scss']
})
export class CompetitionComponent implements OnInit {

    competition: Competition = {...exampleComp};

    rounds: RoundModel[] = [];

    constructor() {
    }

    ngOnInit(): void {
        let initialRound: RoundModel = {
            id: 0,
            riders: this.competition.riders
        }
        this.rounds.push(initialRound);
        const maxRounds = Math.ceil(this.competition.riders.length / 8);
        for (let i = 0; i < maxRounds; i++) {
            this.rounds.push({
                id: i + 1,
                riders: []
            });
        }
    }

    onFinishedRound(promotedRiders: string[]) {
        console.log(promotedRiders)
        for(let i = 0; i < this.rounds.length; i++) {
            console.log(this.rounds[i].riders) // IDEA: PUSH IN NEXT ROUND WITHOUT RIDERS, NOT YET WORKING
            if(!this.rounds[i].riders.length) {
                this.rounds[i].riders = promotedRiders;
            }
        }
    }
}
