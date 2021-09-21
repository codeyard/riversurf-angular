import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SurfEvent} from "../core/models/surf-event.model";
import {Rider} from "../core/models/rider.model";
import {BreakpointObserver} from "@angular/cdk/layout";
import {RidersService} from "../core/services/riders.service";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {SurfEventService} from "../core/services/surf-event.service";
import {MapInfoWindow} from "@angular/google-maps";
import {ActivatedRoute, Router} from "@angular/router";
import {SlugifyPipe} from "../shared/pipes/slugify.pipe";

@Component({
    selector: 'rs-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    @ViewChild(MapInfoWindow) mapInfoWindow!: MapInfoWindow;

    currentSurfEvents$?: Observable<SurfEvent[]>;
    upcomingSurfEvents$?: Observable<SurfEvent[]>;
    pastSurfEvents$?: Observable<SurfEvent[]>;
    randomRiders: Rider[] = [];
    isLoadingRandomRiders = true;
    currentEvent = 0;
    smallScreen?: boolean;

    mapZoom = 9;
    mapOptions: google.maps.MapOptions = {
        mapTypeId: 'roadmap',
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        maxZoom: 20,
        minZoom: 5
    };
    mapInfoContent = '';

    private destroy$ = new Subject();

    constructor(private observer: BreakpointObserver,
                private ridersService: RidersService,
                private surfEventService: SurfEventService,
                private router: Router,
                private route: ActivatedRoute,
                private slugify: SlugifyPipe) {
    }

    ngOnInit(): void {
        this.observer.observe('(max-width: 878px)')

            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                this.smallScreen = result.matches;
            });

        this.ridersService.getRandomRiders(6)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (riders: Rider[]) => {
                    this.isLoadingRandomRiders = false;
                    this.randomRiders = riders
                });

        this.currentSurfEvents$ = this.surfEventService.getCurrentSurfEvents();
        this.upcomingSurfEvents$ = this.surfEventService.getUpcomingSurfEvents();
        this.pastSurfEvents$ = this.surfEventService.getPastSurfEvents();
    }

    ngOnDestroy(): void {
        this.destroy$.next(null);
        this.destroy$.complete();
    }

    goToSurfEvent(surfEvent: SurfEvent) {
        const slugifiedName = this.slugify.transform(surfEvent.name);
        this.router.navigate([`/event/${slugifiedName}-${surfEvent.id}`], {relativeTo: this.route}).then();
    }
}
