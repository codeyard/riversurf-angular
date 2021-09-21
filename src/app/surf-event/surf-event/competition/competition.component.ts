import {Component, OnDestroy, OnInit} from '@angular/core';
import {Competition, Round} from "../../../core/models/competition.model";
import {SnackbarService} from "../../../core/services/snackbar.service";
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {Subscription} from "rxjs";
import {SurfEventService} from "../../../core/services/surf-event.service";

@Component({
    selector: 'rs-competition',
    templateUrl: './competition.component.html',
    styleUrls: ['./competition.component.scss']
})
export class CompetitionComponent implements OnInit, OnDestroy {

    routeSubscription?: Subscription;
    competition!: Competition;
    selectedTabIndex: number = 0;

    constructor(private snackBarService: SnackbarService,
                private route: ActivatedRoute,
                private surfEventService: SurfEventService) {
    }

    ngOnInit(): void {
        this.routeSubscription = this.route.params
            .pipe(
                switchMap(params => {
                    const id = params['id'].split('-').pop();
                    const division = params['division'].toLowerCase();
                    return this.surfEventService.getCompetitionByDivision(id, division);
                })
            )
            .subscribe(
                competition => {
                    this.competition = competition;
                    this.selectedTabIndex = this.competition.rounds
                        .map(round =>
                            round.riders.length > 0 ? 'round-started': 'round-not-started').lastIndexOf("round-started")
                },
                error => {
                    this.snackBarService.send("Unable to load Competition", "error");
                    console.log('ERROR loading competition data :-(', error)
                });
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

    onFinishedRound(event: {currentRound: number, promotedRiders: string[]}) {
        this.competition.rounds[event.currentRound + 1] = {...this.competition.rounds[event.currentRound + 1], riders: event.promotedRiders};
        this.updateCompetition(this.competition.rounds[event.currentRound + 1])
        this.selectedTabIndex = this.selectedTabIndex + 1;
        this.snackBarService.send('Round successfully finished!', 'success');
    }

    getRoundLabel(roundIndex: number): string {
        let label = 'Round ' + (+roundIndex);
        if (roundIndex === 0) {
            label = 'Seeding round';
        } else if (roundIndex === this.competition.rounds.length - 1) {
            label = 'Finals';
        } else if (roundIndex === this.competition.rounds.length - 2) {
            label = 'Semifinals';
        }
        return label;
    }

    updateCompetition(updatedRound: Round) {
        const roundId = updatedRound.id;
        const competitionCopy = {...this.competition}
        competitionCopy.rounds[roundId] = updatedRound

        this.competition = competitionCopy;

        this.surfEventService.updateCompetition(this.competition)
            .subscribe(
                val => () => {},
                error => {
                    this.snackBarService.send("Unable to save changes to server", "error");
                });
    }

    hasNextRoundReady(currentRound: number) {
        return currentRound < this.competition.rounds.length - 1
            ? this.competition.rounds[currentRound+1].riders.length > 0
            : false;
    }
}
