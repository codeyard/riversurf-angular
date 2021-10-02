import {Injectable} from '@angular/core';
import {Event, NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RouterHistoryService {

    private routerHistoryData = new BehaviorSubject<string[]>([]);
    private routerHistory$ = this.routerHistoryData.asObservable();

    constructor(private router: Router) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                if (this.routerHistoryData.value.length === 0 || this.routerHistoryData.value[0] !== event.url) {
                    this.routerHistoryData.value.unshift(event.url);
                    this.routerHistoryData.next(this.routerHistoryData.value);
                }
            }
        })
    }

    getRouterHistory():Observable<string[]>{
        return this.routerHistory$;
    }
}
