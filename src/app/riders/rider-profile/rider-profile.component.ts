import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Rider} from "../../core/models/rider.model";
import {Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";
import {RidersService} from "../../core/services/riders.service";
import {SnackbarService} from "../../core/services/snackbar.service";

@Component({
    selector: 'rs-rider-profile',
    templateUrl: './rider-profile.component.html',
    styleUrls: ['./rider-profile.component.scss']
})
export class RiderProfileComponent implements OnInit, OnDestroy {
    routeSubscription?: Subscription;
    rider ?: Rider;
    isLoading = true;

    constructor(private route: ActivatedRoute, private ridersService: RidersService, private snackBarService: SnackbarService) {

    }

    ngOnInit(): void {
        this.routeSubscription = this.route.params
            .pipe(
                switchMap(params => {
                    const id = params['id'];
                    return this.ridersService.getRider(id)
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
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }
}
