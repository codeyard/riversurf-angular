import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

export type NetworkStatus = 'ONLINE' | 'OFFLINE';

@Injectable({
    providedIn: 'root'
})
export class NetworkStatusService {

    private networkStatusSub = new Subject<NetworkStatus>();
    private networkStatus$ = this.networkStatusSub.asObservable();

    constructor() {
        this.networkStatusSub.next(navigator.onLine ? 'ONLINE' : 'OFFLINE');
        window.addEventListener('offline', () => this.networkStatusSub.next('OFFLINE'));
        window.addEventListener('online', () => this.networkStatusSub.next('ONLINE'));
    }

    public getNetworkStatus() {
        return this.networkStatus$;
    }
}
