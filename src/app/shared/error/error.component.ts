import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterHistoryService} from "../../core/services/router-history.service";
import {Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {SearchService} from "../../core/services/search.service";
import {RouterHistoryModel} from "../../core/models/router-history.model";

@Component({
    selector: 'rs-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

    routerHistory: RouterHistoryModel[] = [];

    errorResource: string = '';

    private routerHistoryServiceSubscription ?: Subscription;

    constructor(private routerHistoryService: RouterHistoryService, private searchService: SearchService) {
    }

    ngOnInit(): void {
        this.routerHistoryServiceSubscription = this.routerHistoryService.getRouterHistory().pipe(
            map((historyUrls: RouterHistoryModel[]) => {
                return historyUrls.slice(0, 6);
            })
        ).subscribe(historyElements  => {
            if (historyElements.length > 0) {
                if (historyElements[0].description !== 'page-not-found') {
                    this.routerHistory = historyElements;
                    if(this.routerHistory[0].description) {
                        this.errorResource = this.routerHistory[0].description;
                    }
                } else {
                    this.routerHistory = historyElements.slice(1);
                    this.errorResource = '';
                }
            } else {
                this.routerHistory = [];
                this.errorResource = '';
            }
        })
    }

    ngOnDestroy() {
        this.routerHistoryServiceSubscription?.unsubscribe();
    }
}
