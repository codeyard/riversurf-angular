import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Rider} from "../models/rider.model";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {AppConfigService} from "./app-config.service";
import {filter, flatMap, map, mergeAll, mergeMap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class RidersService {
    PROTOCOL_HTTPS = 'https://'
    PATH_ENDPOINT = '/api/riders/';
    private ridersData = new BehaviorSubject<Rider[]>([]);
    private riders$ = this.ridersData.asObservable();

    constructor(private httpClient: HttpClient, private appConfigService: AppConfigService) {}

    get riders() {
        return this.ridersData;
    }

    getRiders(): Observable<Rider[]> {
        const requestUrl = this.PROTOCOL_HTTPS + this.appConfigService.getHostName() + this.PATH_ENDPOINT;
        this.httpClient.get<Rider[]>(requestUrl).subscribe(
            (responseData: Rider[]) => this.ridersData.next(responseData),
            error => console.log('ERROR loading riders data :-(', error)
        )

        return this.riders$;
    }

    // TODO: Get Random Riders

    getRider(id: string): Observable<Rider> {
        const index = this.ridersData.value.findIndex(rider => rider.id === id);

        return index > -1
            ? of(this.ridersData.value[index])
            : this.fetchRider(id);

    }

    fetchRider(id: string): Observable<Rider> {
        const requestUrl = this.PROTOCOL_HTTPS + this.appConfigService.getHostName() + this.PATH_ENDPOINT + id;
        this.httpClient.get<Rider>(requestUrl)
            .subscribe(
            (responseData: Rider) => {
                this.ridersData.next([...this.ridersData.value, responseData])
            }
            ,
            error => console.log('ERROR loading riders data :-(', error)
        )
        return this.riders$
            .pipe(
                map(riders => riders.filter(rider => rider.id === id)[0])
            )

    }


    // TODO: Follow a rider
}


// interface StateSyncer {
//     state: {
//         ridersData: Rider[],
//     }
// }
//
// export abstract class Syncer {
//     state: any;
//
//     constructor(private httpClient: HttpClient) {
//
//     }
//
//     get() {
//
//     }
//
//     post() {
//
//     }
//
// }
