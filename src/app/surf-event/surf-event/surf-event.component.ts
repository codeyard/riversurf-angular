import {Component, OnDestroy, OnInit} from '@angular/core';
import {SurfEvent} from "../../core/models/surf-event.model";
import {SurfEventService} from "../../core/services/surf-event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";
import {SnackbarService} from "../../core/services/snackbar.service";
import {Rider} from "../../core/models/rider.model";
import {NetworkStatusService} from "../../core/services/network-status.service";

@Component({
    selector: 'rs-surf-event',
    templateUrl: './surf-event.component.html',
    styleUrls: ['./surf-event.component.scss']
})
export class SurfEventComponent implements OnInit, OnDestroy {
    routeSubscription?: Subscription;
    networkStatusSubscription?: Subscription;
    surfEvent!: SurfEvent;
    isLoading = true;
    enrolledRiders$?: Observable<Rider[]>;

    mapZoom = 17;
    mapOptions: google.maps.MapOptions = {
        mapTypeId: 'roadmap',
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        maxZoom: 20,
        minZoom: 5
    };

    isOffline: boolean = false;


    constructor(
        private surfEventService: SurfEventService,
        private route: ActivatedRoute,
        private router: Router,
        private networkStatusService: NetworkStatusService,
        private snackBarService: SnackbarService) {
    }

    ngOnInit(): void {
        this.routeSubscription = this.route.params
            .pipe(
                switchMap(params => {
                    const id = params['id'].split('-').pop();
                    return this.surfEventService.getSurfEvent(id)
                }))
            .subscribe(
                surfEvent => {
                    this.surfEvent = surfEvent;
                    this.isLoading = false;
                    this.enrolledRiders$ = this.surfEventService.getEnrolledRiders(this.surfEvent.id);
                },
                error => {
                    this.isLoading = false;
                    let defaultMsg = "An error occurred. Please try again!"
                    if (error === "NOT_EXISTS") {
                        defaultMsg = "Sorry mate, it seems like this Jam does not exist!";
                    }
                    this.snackBarService.send(defaultMsg, "error");
                    this.router.navigate(["/"]).then();
                    console.log(error)
                });

        this.networkStatusSubscription = this.networkStatusService.getNetworkStatus().subscribe(status => {
            this.isOffline = status !== 'ONLINE';
        });
    }

    ngOnDestroy() {
        this.networkStatusSubscription?.unsubscribe();
    }
}
