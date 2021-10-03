import {Component, OnDestroy, OnInit} from '@angular/core';
import {Competition, Round} from "../../../core/models/competition.model";
import {SnackbarService} from "../../../core/services/snackbar.service";
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap, tap} from "rxjs/operators";
import {Subscription} from "rxjs";
import {SurfEventService} from "../../../core/services/surf-event.service";
import {Division} from "../../../core/models/division.type";
import {SurfEvent} from "../../../core/models/surf-event.model";

@Component({
    selector: 'rs-competition',
    templateUrl: './competition.component.html',
    styleUrls: ['./competition.component.scss']
})
export class CompetitionComponent implements OnInit, OnDestroy {

    routeSubscription?: Subscription;
    competition!: Competition;
    selectedTabIndex: number = 0;
    selectedDivision!: Division;
    surfEvent!: SurfEvent;

    constructor(private snackBarService: SnackbarService,
                private route: ActivatedRoute,
                private router: Router,
                private surfEventService: SurfEventService,) {
    }

    ngOnInit(): void {
        this.routeSubscription = this.route.params
            .pipe(
                tap(params => {
                    const id = params['id'].split('-').pop();
                    this.surfEventService.getSurfEvent(id).subscribe(surfEvent => {
                        this.surfEvent = surfEvent;
                    })
                }),
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
                            round.riders.length > 0 ? 'round-started' : 'round-not-started').lastIndexOf("round-started")
                },
                error => {
                    this.snackBarService.send("Sorry fella, we couldn't load the Competition", "error");
                    console.log('ERROR loading competition data :-(', error)
                });


    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

    onFinishedRound(event: { currentRound: number, promotedRiders: string[] }) {
        this.competition.rounds[event.currentRound + 1] = {
            ...this.competition.rounds[event.currentRound + 1],
            riders: event.promotedRiders
        };
        this.updateCompetition(this.competition.rounds[event.currentRound + 1])
        this.selectedTabIndex = this.selectedTabIndex + 1;
        this.snackBarService.send("Yeah, round completed! Let's move to the next one", 'success');
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
                () => () => {
                },
                error => {
                    this.snackBarService.send("Sorry mate, we are unable to save your changes!", "error");
                    console.log(error)
                });
    }


    hasNextRoundReady(currentRound: number) {
        return currentRound < this.competition.rounds.length - 1
            ? this.competition.rounds[currentRound + 1].riders.length > 0
            : false;
    }

    goToTournamentView() {
        this.router.navigate(["../"], {relativeTo: this.route})
    }

    toggleDivision(division: Division) {
        this.selectedDivision = division;
        this.router.navigate(['../../', this.selectedDivision, "edit"], {
            relativeTo: this.route
        }).then();
    }
}
