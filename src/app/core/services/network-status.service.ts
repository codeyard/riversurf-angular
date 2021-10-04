import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export type NetworkStatus = 'ONLINE' | 'OFFLINE';

@Injectable({
    providedIn: 'root'
})
export class NetworkStatusService {

    private networkStatusSub = new BehaviorSubject<NetworkStatus>('OFFLINE');
    private networkStatus$ = this.networkStatusSub.asObservable();

    constructor() {
        this.networkStatusSub.next(navigator.onLine ? 'ONLINE' : 'OFFLINE');
        window.addEventListener('offline', () => this.networkStatusSub.next('OFFLINE'));
        window.addEventListener('online', () => this.networkStatusSub.next('ONLINE'));
    }

    public getNetworkStatus(): Observable<NetworkStatus> {
        return this.networkStatus$;
    }

    public getCurrentNetworkStatus(): NetworkStatus {
        return this.networkStatusSub.getValue();
    }
}
