import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterHistoryService} from "../../core/services/router-history.service";
import {Subscription} from "rxjs";
import {filter, map, switchMap} from "rxjs/operators";
import {SearchService} from "../../core/services/search.service";
import {RouterHistoryModel} from "../../core/models/router-history.model";
import {SurfEvent} from "../../core/models/surf-event.model";
import {Rider} from "../../core/models/rider.model";

@Component({
    selector: 'rs-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

    routerHistory: RouterHistoryModel[] = [];
    errorResource: string = '';
    searchedSurfEvents ?: SurfEvent[];
    searchedRiders ?: Rider[];

    private HISTORY_LIMIT = 6;
    private SEARCH_LIMIT = 9;

    private searchSubscription ?: Subscription;

    constructor(private routerHistoryService: RouterHistoryService, private searchService: SearchService) {
    }

    ngOnInit(): void {
        this.searchSubscription = this.routerHistoryService.getRouterHistory().pipe(
            map((historyUrls: RouterHistoryModel[]) => {
                historyUrls = historyUrls.slice(0, this.HISTORY_LIMIT);
                if (historyUrls.length > 0) {
                    this.errorResource = historyUrls[0].description !== 'page-not-found' ? historyUrls[0].description : '';
                    this.routerHistory = this.errorResource ? historyUrls : historyUrls.slice(1);
                    if (this.errorResource) {
                        if (!this.routerHistory[0].error) {
                            this.routerHistoryService.markErrorInHistory(0);
                            this.routerHistory[0].error = true;
                        }
                    }
                } else {
                    this.routerHistory = [];
                    this.errorResource = '';
                }
                return this.errorResource;
            }),
            filter(searchTerm => searchTerm !== ''),
            switchMap(searchTerm => this.searchService.searchByTerm(searchTerm)),
            map(([events, riders]) => {
                events = events.slice(0, this.SEARCH_LIMIT);
                riders = riders.slice(0,this.SEARCH_LIMIT);
                return [events, riders];
            })
        ).subscribe(([events, riders]) => {
            this.searchedSurfEvents = events as SurfEvent[];
            this.searchedRiders = riders as Rider[];
        });
    }

    ngOnDestroy() {
        this.searchSubscription?.unsubscribe();
    }
}
