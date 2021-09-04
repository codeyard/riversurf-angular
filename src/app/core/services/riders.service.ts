import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Rider} from "../models/rider.model";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RidersService {
    RIDERS_BASE_URL = 'https://test-riversurf-springboot.azurewebsites.net/api/riders/';
    private ridersData = new BehaviorSubject<Rider[]>([]);

    constructor(private httpClient: HttpClient) {
        this.loadRidersData();
    }

    get riders() {
        return this.ridersData;
    }

    private loadRidersData() {
        this.httpClient.get<Rider[]>(this.RIDERS_BASE_URL).subscribe(
            response => this.ridersData.next(response),
            error => console.log('ERROR loading riders data :-(', error)
        )
    }

    // TODO: Follow a rider
    // TODO: Get Single Rider
    // TODO: Get Random Riders
}
