import {Component} from '@angular/core';
import {NetworkStatus, NetworkStatusService} from "../network-status/network-status.service";
import {Observable} from "rxjs";

@Component({
    selector: 'surf-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    networkStatus$: Observable<NetworkStatus>;

    constructor(private networkStatusService: NetworkStatusService) {
        this.networkStatus$ = this.networkStatusService.getNetworkStatus();
    }

}
