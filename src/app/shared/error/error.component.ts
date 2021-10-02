import {Component, OnInit} from '@angular/core';
import {RouterHistoryService} from "../../core/services/router-history.service";

@Component({
    selector: 'rs-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

    routerHistory: {
        url: string,
        description: string
    }[] = [];

    errorResource: string = '';

    constructor(private routerHistoryService: RouterHistoryService) {
    }

    ngOnInit(): void {
        const lastUrls = this.routerHistoryService.getLastUrls(6);
        if (lastUrls.length > 0) {
            this.routerHistory = lastUrls.map(x => {
                const queryParamIndex = x.indexOf('?');
                if (queryParamIndex !== -1) {
                    x = x.substring(0, queryParamIndex);
                }
                const dest = x === '/' ? 'Home' : x.substring(1);
                return {
                    url: x,
                    description: dest
                }
            });
            if (this.routerHistory.length > 0 && this.routerHistory[0].description !== 'page-not-found') {
                this.errorResource = this.routerHistory[0].description;
            } else {
                this.errorResource = '';
            }
        } else {
            this.routerHistory = [];
            this.errorResource = '';
        }
    }
}
