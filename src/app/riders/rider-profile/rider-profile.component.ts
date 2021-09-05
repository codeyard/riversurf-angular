import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Rider, exampleRiderMale} from "../../core/models/rider.model";
import {Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";
import {RidersService} from "../../core/services/riders.service";

@Component({
    selector: 'rs-rider-profile',
    templateUrl: './rider-profile.component.html',
    styleUrls: ['./rider-profile.component.scss']
})
export class RiderProfileComponent implements OnInit, OnDestroy {
    routeSubscription?: Subscription;
    riderId: String = 'unknown';
    rider ?: Rider;

    constructor(private route: ActivatedRoute, private ridersService: RidersService) {

    }

    ngOnInit(): void {
        this.routeSubscription = this.route.params
            .pipe(
                switchMap(params => {
                    const id = params['id'];
                    return this.ridersService.getRider(id)
                })
            )
            .subscribe(rider => {
                this.rider = rider;
        });
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }
}
