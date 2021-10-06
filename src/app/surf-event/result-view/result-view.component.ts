import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Competition, Heat} from "../../core/models/competition.model";
import {RiderResultComponent} from "../surf-event/competition/round/rider-result/rider-result.component";
import {combineLatest, Subject, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {SurfEventService} from "../../core/services/surf-event.service";
import {debounceTime, distinctUntilChanged, mergeMap, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {SnackbarService} from "../../core/services/snackbar.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {CarouselComponent} from "../../shared/carousel/carousel.component";
import {UserService} from "../../core/services/user.service";
import {SurfEvent} from "../../core/models/surf-event.model";
import {WeatherLocation, weatherLocations} from "../weather/weather-location";
import {Division} from "../../core/models/division.type";
import {NetworkStatusService} from "../../core/services/network-status.service";

export interface Line {
    source: Point,
    target: Point,
    path: string,
    riderId: string
}

interface Point {
    x: number,
    y: number
}

interface RiderProgress {
    riderId: string,
    maxRound: number
}

@Component({
    selector: 'rs-result-view',
    templateUrl: './result-view.component.html',
    styleUrls: ['./result-view.component.scss']
})
export class ResultViewComponent implements OnInit, AfterViewInit, OnDestroy {
    competition!: Competition;
    surfEvent!: SurfEvent;
    @ViewChildren(RiderResultComponent) results!: QueryList<any>;
    @ViewChildren(CarouselComponent) carousel?: QueryList<any>
    queryParamSubscription?: Subscription;
    networkStatusSubscription?: Subscription;
    weatherLocation?: WeatherLocation;

    lines: Line[] = [];
    points: Point[] = []
    isAdministrator = false;
    highlightedRider?: string;
    highlightActive = false;

    RIDER_WIDTH = 250;
    RIDER_HALF_HEIGHT = 25;

    CURVE_RADIUS = 20;
    VARIANZ = 0;
    VARIANZ_OFFSET = 0;

    isLoading = true;
    init!: Subscription;
    smallScreen?: boolean;

    qrCodeLink?: string;
    selectedDivision?: Division;
    isOffline!: boolean;

    private windowResizeSubject$ = new Subject<number | null>();
    private selectedSurfEvent: string = '';

    private destroy$ = new Subject();

    constructor(private cd: ChangeDetectorRef,
                private snackBarService: SnackbarService,
                private route: ActivatedRoute,
                private router: Router,
                private userService: UserService,
                private surfEventService: SurfEventService,
                private observer: BreakpointObserver,
                private networkStatusService: NetworkStatusService) {
    }

    ngOnInit(): void {
        this.queryParamSubscription = this.route.queryParams.subscribe(params => {
            const highlightedRider = params['highlight'];
            if (highlightedRider) {
                this.highlightRider(highlightedRider);
            } else {
                this.highlightActive = false;
            }
        });


        this.init = this.route.params
            .pipe(
                mergeMap(params => {
                    const id = params['id'].split('-').pop();
                    const division = params['division'].toLowerCase();
                    this.selectedDivision = division as Division;
                    this.selectedSurfEvent = id;
                    return this.surfEventService.getCompetitionByDivision(id, division);
                }),
                tap(() => this.isLoading = false),
            ).subscribe(
                (competition: Competition) => {
                    this.competition = competition;
                    this.isLoading = false;
                    this.cd.detectChanges();
                    this.calcPointsAndLines();
                },
                (error: string) => {
                    let errorMessage = "Sorry fella, we couldn't load the Competition";
                    let routerNavigation = '/';
                    if (error === "NON_EXISTING_COMPETITION") {
                        errorMessage = "Sorry mate, it seems like this Competition does not exist!";
                        routerNavigation += 'event/' + this.selectedSurfEvent;
                        this.snackBarService.send(errorMessage, "error");
                        this.router.navigate([routerNavigation]).then();
                    }

                });

        this.observer.observe('(max-width: 878px)')
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                this.smallScreen = result.matches;
                if (this.smallScreen && this.highlightedRider && this.highlightActive) {
                    this.highlightRider(this.highlightedRider);
                }
            });

        this.qrCodeLink = window.location.toString();

        combineLatest(this.getUser(), this.getSurfEvent()).subscribe(
            ([user, surfEvent]) => {
                this.surfEvent = surfEvent;
                this.guessWeatherLocation(this.surfEvent.location);
                if (user.isAuthenticated) {
                    if (surfEvent.judge === user.id || surfEvent.organizer === user.id) {
                        this.isAdministrator = true;
                    }
                } else {

                }
            }
        );

        this.windowResizeSubject$.pipe(
            tap(() => {
                this.lines = [];
                this.points = [];
            }),
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(() => {
            this.cd.detectChanges();
            this.calcPointsAndLines();
        });

        this.networkStatusSubscription = this.networkStatusService.getNetworkStatus().subscribe(status => {
            this.isOffline = status !== 'ONLINE';
        });
    }

    ngAfterViewInit(): void {
        this.carousel?.changes.subscribe(
            () => this.setCarouselIndexes()
        )
    }


    ngOnDestroy(): void {
        this.destroy$.next(null);
        this.destroy$.complete();
        this.windowResizeSubject$.unsubscribe();
        this.init.unsubscribe();
    }

    addHighlightedRiderToRoute(riderId: string, event: Event) {
        event.stopImmediatePropagation();
        if (this.highlightActive && riderId === this.highlightedRider) {
            this.unHighlightRider();
        } else {
            this.router.navigate([], {
                queryParams: {highlight: riderId},
                queryParamsHandling: 'merge',
            }).then();
        }
    }

    unHighlightRider() {
        this.router.navigate([], {
            queryParams: {highlight: null},
            queryParamsHandling: 'merge',
        }).then();
    }

    getHeatNumberOfRider(roundIndex: number, riderId: string): number | undefined {
        let riderIndex: number | undefined = undefined;
        const heats = this.competition.rounds[roundIndex].heats;

        for (let i = 0; i < heats.length; i++) {
            if (heats[i].riders.indexOf(riderId) > -1) {
                riderIndex = i;
            }
        }

        return riderIndex;
    }

    getHeatStatus(heat: Heat) {
        switch (heat.state) {
            case 'finished':
            case 'completed':
                return 'finished';
            case 'running':
                return 'surfing';
            default:
                return 'assigned';
        }
    }

    calcPointsAndLines() {
        this.lines = [];
        this.points = [];
        const ridersWithTheirMaxRound: RiderProgress[] = [];
        this.competition.rounds.forEach((round, roundNumber) =>
            round.heats.forEach(heat =>
                heat.riders.forEach(rider => {
                        ridersWithTheirMaxRound.push({riderId: rider, maxRound: roundNumber})
                    }
                )
            ));

        const result = this.getRidersWithRespectiveMaxRound(ridersWithTheirMaxRound);

        for (const rider of result) {
            let points: Point[] = [];
            this.results.forEach(resultElementRef => {
                if (resultElementRef.riderId === rider.riderId) {
                    const leftPoint = {
                        x: resultElementRef.elementRef.nativeElement.offsetLeft - 3,
                        y: resultElementRef.elementRef.nativeElement.offsetTop + this.RIDER_HALF_HEIGHT
                    }
                    const rightPoint = {
                        ...leftPoint,
                        x: resultElementRef.elementRef.nativeElement.offsetLeft + this.RIDER_WIDTH + 3
                    }

                    if (resultElementRef.roundNumber === 0) {
                        points.push(rightPoint)
                        this.points.push(rightPoint)
                    } else if (resultElementRef.roundNumber === (this.competition.rounds.length - 1) || resultElementRef.roundNumber === rider.maxRound) {
                        points.push(leftPoint)
                        this.points.push(leftPoint)
                    } else {
                        points.push(leftPoint, rightPoint)
                        this.points.push(leftPoint, rightPoint)
                    }
                }
            })

            for (let i = 0; i < points.length; i += 2) {
                try {
                    let {a, b} = this.extractPoints(points, i);
                    let path = this.calculatePath(a, b);
                    this.lines.push({
                        source: a,
                        target: b,
                        path: path,
                        riderId: rider.riderId
                    })
                } catch (notLineException) {
                    // EMPTY AS NO NEED TO ADD LINE
                }
            }

        }
    }

    getUser() {
        return this.userService.getUser().pipe(
            take(1))
    }

    getSurfEvent() {
        return this.route.params
            .pipe(
                switchMap(params => {
                    const id = params['id'].split('-').pop();
                    return this.surfEventService.getSurfEvent(id);
                })
            )
    }

    getRidersWithRespectiveMaxRound(ridersWithResult: RiderProgress[]): RiderProgress[] {
        const temp = new Map();

        for (const item of ridersWithResult) {
            const element = temp.get(item.riderId)
            if (element) {
                element.riderId = item.riderId
                element.maxRound = Math.max(element.maxRound, item.maxRound);
            } else {
                temp.set(item.riderId,
                    {riderId: item.riderId, maxRound: item.maxRound})
            }
        }

        return Array.from(temp.values());
    }

    extractPoints(points: Point[], i: number): { a: Point, b: Point } {
        return {
            a: {
                x: points[i].x,
                y: points[i].y
            },
            b: {
                x: points[i + 1].x,
                y: points[i + 1].y
            }

        }
    }

    calculatePath(a: Point, b: Point) {
        const deltaX = b.x - a.x;
        const varianz = Math.random() * this.VARIANZ + this.VARIANZ_OFFSET;
        const middleX = a.x + (deltaX / 2) + varianz;
        let deltaY = b.y - a.y;
        let middleY = a.y + (deltaY / 2);
        let signY = Math.sign(deltaY)
        // funktioniert momentan nur für horizontale verbindungen, für vertikale, muss wohl auch noch ein signX eingesetzt werden
        // M 0 0 L 1 0 Q 2 0 2 1 L 2 2 L 2 3 Q 2 4 3 4 L 4 4
        let path = `M ${a.x} ${a.y} L ${middleX - this.CURVE_RADIUS} ${a.y} Q ${middleX} ${a.y} ${middleX} ${a.y + signY * this.CURVE_RADIUS} L ${middleX} ${middleY} L ${middleX} ${b.y - signY * this.CURVE_RADIUS} Q ${middleX} ${b.y} ${middleX + this.CURVE_RADIUS} ${b.y} L ${b.x} ${b.y}`;
        return path;
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

    editCompetition() {
        this.router.navigate(["edit"], {relativeTo: this.route}).then();
    }

    toggleDivision(division: Division): void {
        this.selectedDivision = division;
        this.lines = [];
        this.points = [];
        this.highlightedRider = '';
        this.highlightActive = false;
        this.router.navigate(['../', this.selectedDivision], {
            relativeTo: this.route
        }).then();


    }

    guessWeatherLocation(location: string) {
        const locationParts: string[] = location.toLowerCase().split(',').join('').split(' ').reverse();

        locationParts.forEach(word => {
            const position = weatherLocations.indexOf(word);
            if (position > -1) {
                this.weatherLocation = weatherLocations[position] as WeatherLocation;
                return;
            }
        });
    }

    onResize(event: any) {
        this.windowResizeSubject$.next(event.target.innerWidth);
    }

    hasCompetitionStarted() {
        return !this.competition?.rounds.every(round => round.heats.length === 0);
    }

    private highlightRider(riderId: string) {
        this.highlightedRider = riderId;
        this.highlightActive = true;

        if (this.smallScreen) {
            this.setCarouselIndexes();
        }
    }

    private setCarouselIndexes() {
        if (this.smallScreen) {
            this.carousel?.forEach((item, roundIndex) => {
                if (this.highlightedRider) {
                    const heatNumber = this.getHeatNumberOfRider(roundIndex, this.highlightedRider)
                    if (heatNumber !== undefined) {
                        item.setIndex(heatNumber)
                    } else {
                        item.setIndex(0);
                    }
                }
            });
        }
    }
}
