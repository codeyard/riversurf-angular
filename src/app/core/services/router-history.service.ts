import {Injectable} from '@angular/core';
import {Event, NavigationEnd, Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class RouterHistoryService {

    private routerHistory: string[] = [];

    constructor(private router: Router) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                if (this.routerHistory.length === 0 || this.routerHistory[0] !== event.url) {
                    this.routerHistory.unshift(event.url);
                }
            }
        })
    }

    getLastUrls(amount ?: number) {
        return this.routerHistory.slice(0, amount);
    }
}
