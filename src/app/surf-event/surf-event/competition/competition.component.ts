import {Component, OnDestroy, OnInit} from '@angular/core';
import {Competition, Round} from "../../../core/models/competition.model";
import {SnackbarService} from "../../../core/services/snackbar.service";
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {Subscription} from "rxjs";
import {SurfEventService} from "../../../core/services/surf-event.service";
import {log} from "util";

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

    onFinishedRound(promotedRiders: string[]) {
        for (let i = 0; i < this.competition.rounds.length; i++) {
            if (!this.competition.rounds[i].riders.length) {
                this.competition.rounds[i] = {...this.competition.rounds[i], riders: promotedRiders};
                this.updateCompetition(this.competition.rounds[i])
                break;
            }
        }
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
                    console.log('ERROR unable to save data :-(', error)
                    this.snackBarService.send("Unable to save changes to server", "error");
                });
    }
}
