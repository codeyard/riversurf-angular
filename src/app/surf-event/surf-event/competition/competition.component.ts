import {Component, OnDestroy, OnInit} from '@angular/core';
import {Competition, exampleComp, Round} from "../../../core/models/competition.model";
import {SnackbarService} from "../../../core/services/snackbar.service";
import {CompetitionService} from "../../../core/services/competition.service";
import {ActivatedRoute} from "@angular/router";
import {filter, switchMap} from "rxjs/operators";
import {Subscription} from "rxjs";
import {SurfEventService} from "../../../core/services/surf-event.service";
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

    constructor(private snackBarService: SnackbarService,
                private route: ActivatedRoute,
                private surfEventService : SurfEventService) {
    }

    ngOnInit(): void {
        this.routeSubscription = this.route.params
            .pipe(
                switchMap(params => {
                    const id = params['id'];
                    const division = params['division'].toLowerCase();
                    console.log(`Gathered id: ${id}, division: ${division}`);
                    return this.surfEventService.getCompetitionByDivision(id, division);
                })
            )
            .subscribe(
                competition => {
                    this.competition = competition;
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
                this.competition.rounds[i].riders = promotedRiders;
                break
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
}
