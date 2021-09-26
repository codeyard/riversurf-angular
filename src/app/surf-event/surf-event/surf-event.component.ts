import {Component, OnInit} from '@angular/core';
import {SurfEvent} from "../../core/models/surf-event.model";
import {SurfEventService} from "../../core/services/surf-event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {catchError, filter, switchMap} from "rxjs/operators";
import {SnackbarService} from "../../core/services/snackbar.service";
import {Rider} from "../../core/models/rider.model";

@Component({
    selector: 'rs-surf-event',
    templateUrl: './surf-event.component.html',
    styleUrls: ['./surf-event.component.scss']
})
export class SurfEventComponent implements OnInit {
    routeSubscription?: Subscription;
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


    constructor(
        private surfEventService: SurfEventService,
        private route: ActivatedRoute,
        private router: Router,
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
                    let defaultMsg = "An error occured. Please try again!"
                    if(error === "NOT_EXISTS") {
                        defaultMsg = "Sorry mate, it seems like this Jam does not exist!";
                    }
                    this.snackBarService.send( defaultMsg, "error");
                    this.router.navigate(["/"]);
                    console.log(error)
                });
    }
}
