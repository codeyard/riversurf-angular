import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterHistoryService} from "../../core/services/router-history.service";
import {Subscription} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: 'rs-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

    routerHistory: {
        url: string,
        description: string
    }[] = [];

    errorResource: string = '';

    private routerHistoryServiceSubscription ?: Subscription;

    constructor(private routerHistoryService: RouterHistoryService) {
    }

    ngOnInit(): void {
        this.routerHistoryServiceSubscription = this.routerHistoryService.getRouterHistory().pipe(
            map((historyUrls: string[]) => {
                historyUrls = historyUrls.slice(0, 6);
                const result = [];
                for (let historyUrl of historyUrls) {
                    const queryParamIndex = historyUrl.indexOf('?');
                    if (queryParamIndex !== -1) {
                        historyUrl = historyUrl.substring(0, queryParamIndex);
                    }
                    const dest = historyUrl === '/' ? 'Home' : historyUrl.substring(1);
                    result.push({
                        url: historyUrl,
                        description: dest
                    });
                }
                return result;
            })
        ).subscribe(historyElements => {
            if (historyElements.length > 0) {
                if (historyElements[0].description !== 'page-not-found') {
                    this.routerHistory = historyElements;
                    this.errorResource = this.routerHistory[0].description;
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
