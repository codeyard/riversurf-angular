import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Rider} from "../models/rider.model";
import {BehaviorSubject, Observable} from "rxjs";
import {AppConfigService} from "./app-config.service";
import {filter, map, take} from "rxjs/operators";
import {DexieService} from "./dexie.service";
import {NetworkStatusService} from "./network-status.service";
import {GenericCollectionResponseModel} from "../models/generic-collection-response.model";
import {SnackbarService} from "./snackbar.service";

/**
 * Riders are versioned by collection, we track the version of the whole collection
 * instead of one individual rider
 * if a rider is added or updated in the backend, the version of the whole riders collection is increased
 *
 * Riders can at the moment (this is out of scope of this project) not be updated or added in the frontend
 * so all changes come from the backend.
 *
 * If we want to add or update riders in the frontend in the future, we always first try to get the latest version of the
 * Collection from the backend push or changes back when updated...
 */
@Injectable({
    providedIn: 'root'
})
export class RidersService {
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
        private networkStatusService: NetworkStatusService,
        private snackBarService: SnackbarService
    ) {
        this.dexieDB = dexieService.getDB();
        this.dexieDB.riders.toArray().then((riders: Rider[]) => {
            this.ready = true;
            this.fetchAllRidersWithVersioning();
            this.ridersData.next(riders);
        });
        this.networkStatus
            .pipe(filter(status => status === 'ONLINE'))
            .subscribe((status) => {
                console.log('We are back online, lets sync!');
            })
    }

    getRiders(): Observable<Rider[]> {
        return this.riders$.pipe(
            map(results => {
                return results.sort((a, b) => (a.lastName + '' + a.firstName).localeCompare((b.lastName + '' + b.firstName)))
            })
        );
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
                filter(riders => riders.length > 0),
                map(riders => {
                    if(riders.filter(rider => rider.id === id)[0] !== undefined) {
                        return riders.filter(rider => rider.id === id)[0]
                    } else {
                        throw "NOT_EXISTS";
                    }
                })
            );

    }

    getRidersByIds(ids: string[]): Observable<Rider[]> {
        return this.riders$
            .pipe(
                filter(riders => riders.length > 0),
                map(riders => riders.filter(rider => ids.includes(rider.id)))
            );
    }

    getRandomRiders(amount?: number): Observable<Rider[]> {
        amount = amount || 5;

        return this.riders$.pipe(
            filter(riders => riders.length > 0),
            map(riders => {
                if (amount! >= riders.length) {
                    return riders;
                }
                const randomRiders = new Set<Rider>();
                for (let i = 0; i <= 200 && randomRiders.size < amount!; i++) {
                    randomRiders.add(riders[Math.floor(Math.random() * riders.length)]);
                }
                return [...randomRiders];
            }),
            take(1));
    }

    private fetchAllRidersWithVersioning(): void {
        const requestUrl = this.appConfigService.getProtocol() + this.appConfigService.getHostName() + this.PATH_ENDPOINT;
        this.httpClient.get<GenericCollectionResponseModel<Rider[]>>(requestUrl).subscribe(
            (responseData: GenericCollectionResponseModel<Rider[]>) => {
                if (responseData.version > 0) {
                    const allPromises: Promise<any>[] = []
                    responseData.payload.forEach(rider => {
                        allPromises.push(this.dexieDB.riders.put(rider));
                    });
                    Promise.all(allPromises)
                        .then(() => this.dexieDB.riders.toArray())
                        .then(riders => this.ridersData.next(riders));
                    this.dexieDB.versions.put({
                        topic: responseData.topic,
                        version: responseData.version
                    })
                } else {
                     // our riders were up to date already
                }
            },
            error => {
                // Error loading riders data
                this.snackBarService.send("Sorry mate, We could not get the riders data. Try again!", "error");
                console.log('ERROR loading riders data :-(', error)
            }
        )
    }
}
