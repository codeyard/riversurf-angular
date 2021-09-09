import {Component, OnDestroy, OnInit} from '@angular/core';
import {SurfEvent, exampleEvent} from "../core/models/surf-event.model";
import {Rider} from "../core/models/rider.model";
import {BreakpointObserver} from "@angular/cdk/layout";
import {RidersService} from "../core/services/riders.service";
import {Subscription} from "rxjs";
import {SnackbarService} from "../core/services/snackbar.service";

@Component({
    selector: 'rs-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    events: SurfEvent[] = [exampleEvent, exampleEvent, exampleEvent, exampleEvent, exampleEvent, exampleEvent];
    randomRiders: Rider[] = [];
    ridersSubscription?: Subscription;
    breakpointSubscription?: Subscription;
    isLoadingRandomRiders = true;

    currentEvent = 0;

    smallScreen?: boolean;

    constructor(private observer: BreakpointObserver, private ridersService: RidersService, private snackBarService: SnackbarService) {
    }

    ngOnInit(): void {
        this.breakpointSubscription = this.observer.observe('(max-width: 878px)').subscribe(result => {
            this.smallScreen = result.matches;
        });

        this.ridersSubscription = this.ridersService.getRandomRiders(6)
            .subscribe(
                (responseData: Rider[]) => {
                    this.isLoadingRandomRiders = false;
                    this.randomRiders = responseData
                },
                error => {
                    this.isLoadingRandomRiders = false;
                    this.snackBarService.send("Unable to load Riders", "error");
                    console.log('ERROR loading riders data :-(', error)
                })


    }

    ngOnDestroy(): void {
        this.ridersSubscription?.unsubscribe();
        this.breakpointSubscription?.unsubscribe();
    }
}
