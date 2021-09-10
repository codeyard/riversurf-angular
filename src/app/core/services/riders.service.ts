import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Rider} from "../models/rider.model";
import {BehaviorSubject, from, Observable, of} from "rxjs";
import {AppConfigService} from "./app-config.service";
import {filter, map, switchMap, toArray} from "rxjs/operators";
import {DexieService} from "./dexie.service";
import {NetworkStatusService, NetworkStatus} from "./network-status.service";
import {GenericCollectionResponseModel} from "../models/generic-collection-response.model";

/**
 * Riders are versioned by collection, we track the version of the whole collection
 * instead of one individual rider
 * if a rider is added or updated in the packend, the version of the whole riders collection is increased
 *
 * Riders can at the moment (this is out of scope of this project) not be updated or added in the frontend
 * so all changes come from the backend.
 *
 * If we want to add or update riders in the FE in the future, we allways first try to get the latest version of the
 * Colleciton from the backend push oure changes back when updated...
 */
@Injectable({
    providedIn: 'root'
})
export class RidersService {
    PROTOCOL_HTTPS = 'http://'
    PATH_ENDPOINT = '/api/riders';

    private ridersData = new BehaviorSubject<Rider[]>([]);
    private riders$ = this.ridersData.asObservable();

    private networkStatus = this.networkStatusService.getNetworkStatus();

    dexieDB: any;

    private ready = false;

    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
        private dexieService: DexieService,
        private networkStatusService: NetworkStatusService
    ) {
        this.dexieDB = dexieService.getDB();
        this.dexieDB.riders.toArray().then((riders: Rider[]) => {
            this.ready = true;
            this.ridersData.next(riders);
        });
        this.networkStatus
            .pipe(filter(status => status === 'ONLINE'))
            .subscribe(status => {
                console.log('We are back online, lets sync!');
                //this.sync();
            })
    }

    getRiders(): Observable<Rider[]> {
        return this.riders$;
    }

    getRider(id: string): Observable<Rider> {
        // FIXME: indexed db and subject might not be ready yet, fetch missing rider in an other way...
        /*
        const index = this.ridersData.value.findIndex(rider => rider.id === id);
        if(index === -1){
            this.fetchAllRidersWithVersioning();
        }
         */
        return this.riders$
            .pipe(
                map(riders => riders.filter(rider => rider.id === id)[0])
            )

    }

    getRidersByIds(ids: string[]): Observable<Rider[]> {
        return from(ids).pipe(
            switchMap(id => this.getRider(id)),
            toArray()
        );
    }

    getRandomRiders(amount?: number): Observable<Rider[]> {
        amount = amount || 5;

        return this.riders$.pipe(
            filter(() => this.ready),
            map(riders => {
                if (amount! >= riders.length) {
                    return riders;
                }
                const randomRiders = new Set<Rider>();
                for (let i = 0; i <= 200 && randomRiders.size < amount!; i++) {
                    randomRiders.add(riders[Math.floor(Math.random() * riders.length)]);
                }
                return [...randomRiders];
            }));
    }

    private fetchAllRidersWithVersioning(): void {
        const requestUrl = this.PROTOCOL_HTTPS + this.appConfigService.getHostName() + this.PATH_ENDPOINT;
        this.httpClient.get<GenericCollectionResponseModel<Rider[]>>(requestUrl).subscribe(
            (responseData: GenericCollectionResponseModel<Rider[]>) => {
                if (responseData.version > 0) {
                    responseData.payload.forEach(rider => {
                        this.dexieDB.riders.put(rider).then(this.ridersData.next(this.dexieDB.riders.toArray()));
                    })
                    this.dexieDB.versions.put({
                        topic: responseData.topic,
                        version: responseData.version
                    })
                } else {
                    console.log('our riders were up to date already')
                }
            },
            error => {
                console.log('ERROR loading riders data :-(', error)
            }
        )
    }
}
