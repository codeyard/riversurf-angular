import {Injectable} from '@angular/core';
import {Event, NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {RouterHistoryModel} from "../models/router-history.model";

@Injectable({
    providedIn: 'root'
})
export class RouterHistoryService {

    private routerHistoryData = new BehaviorSubject<RouterHistoryModel[]>([]);
    private routerHistory$ = this.routerHistoryData.asObservable();

    constructor(private router: Router) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {

                const historyElement: RouterHistoryModel = {
                    url: event.url,
                    error: false,
                    description: ''
                };

                const queryParamIndex = historyElement.url.indexOf('?');
                if (queryParamIndex !== -1) {
                    historyElement.url = historyElement.url.substring(0, queryParamIndex);
                    historyElement.queryString = event.url.substring(queryParamIndex);
                    const queryParams = new URLSearchParams(historyElement.queryString);
                    historyElement.queryParams = {};
                    queryParams.forEach(((value, key) => {
                        historyElement.queryParams[key] = value;
                    }));
                }

                if (historyElement.url === '/') {
                    historyElement.description = 'Home';
                    if (historyElement.queryString) {
                        historyElement.description += ` (${historyElement.queryString})`;
                    }
                } else {
                    historyElement.description = historyElement.url.substring(1);
                }

                console.log(`Created history`, historyElement);

                if (this.routerHistoryData.value.length === 0 || this.routerHistoryData.value[0].url !== historyElement.url) {
                    this.routerHistoryData.value.unshift(historyElement);
                    this.routerHistoryData.next(this.routerHistoryData.value);
                }
            }
        })
    }

    getRouterHistory(): Observable<RouterHistoryModel[]> {
        return this.routerHistory$;
    }
}
