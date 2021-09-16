import {Component, OnDestroy, OnInit} from '@angular/core';
import {Competition, exampleComp, Round} from "../../../core/models/competition.model";
import {SnackbarService} from "../../../core/services/snackbar.service";
import {CompetitionService} from "../../../core/services/competition.service";
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
    selector: 'rs-competition',
    templateUrl: './competition.component.html',
    styleUrls: ['./competition.component.scss']
})
export class CompetitionComponent implements OnInit, OnDestroy {

    routeSubscription?: Subscription;

    competition!: Competition;

    selectedTabIndex: number = 0;

    constructor(private snackBarService: SnackbarService, private competitionService : CompetitionService, private route: ActivatedRoute) {
    }

    ngOnInit(): void{
        this.routeSubscription = this.route.params
            .pipe(
                switchMap(params => {
                    const id = params['id'].split('-').pop();
                    return this.competitionService.getCompetition(id)
                })
            )
            .subscribe(
                rider => {
                    this.isLoading = false;
                    this.rider = rider;
                },
                error => {
                    this.isLoading = false;
                    this.snackBarService.send("Unable to load Riders", "error");
                    console.log('ERROR loading riders data :-(', error)
                });
        this.competition = ;
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

    onFinishedRound(promotedRiders: string[]) {
        for(let i = 0; i < this.rounds.length; i++) {
            if(!this.rounds[i].riders.length) {
                this.rounds[i].riders = promotedRiders;
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
        } else if (roundIndex === this.rounds.length - 1) {
            label = 'Finals';
        } else if (roundIndex === this.rounds.length - 2) {
            label = 'Semifinals';
        }
        return label;
    }
}
