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

    private searchSubscription ?: Subscription;

    constructor(private routerHistoryService: RouterHistoryService, private searchService: SearchService) {
    }

    ngOnInit(): void {
        this.searchSubscription = this.routerHistoryService.getRouterHistory().pipe(
            map((historyUrls: RouterHistoryModel[]) => {
                historyUrls = historyUrls.slice(0, 6);
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
            switchMap(searchTerm => this.searchService.searchByTerm(searchTerm))
        ).subscribe(([events, riders]) => {
            console.log(`Search results: events`, events as SurfEvent[]);
            console.log(`Search results: riders`, riders as Rider[]);
        });
    }

    ngOnDestroy() {
        this.searchSubscription?.unsubscribe();
    }
}
