import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterHistoryService} from "../../core/services/router-history.service";

@Component({
    selector: 'rs-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

    routerHistory: string[] = [];

    constructor(private routerHistoryService: RouterHistoryService) {
    }

    ngOnInit(): void {
        this.routerHistory = this.routerHistoryService.getLastUrls();
    }

    ngOnDestroy() {

    }

}
