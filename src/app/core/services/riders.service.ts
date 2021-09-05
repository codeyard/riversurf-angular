import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Rider} from "../models/rider.model";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RidersService {
    RIDERS_BASE_URL = 'https://test-riversurf-springboot.azurewebsites.net/api/riders/';
    private ridersData = new Subject<Rider[]>();

    constructor(private httpClient: HttpClient) {
        this.loadRidersData();
    }

    get riders() {
        return this.ridersData;
    }

    private loadRidersData() {
        this.httpClient.get<Rider[]>(this.RIDERS_BASE_URL).subscribe(
            (responseData: Rider[]) => this.ridersData.next(responseData),
            error => console.log('ERROR loading riders data :-(', error)
        )
    }

    // TODO: Follow a rider
    // TODO: Get Single Rider
    // TODO: Get Random Riders
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
