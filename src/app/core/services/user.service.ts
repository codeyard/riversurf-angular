import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Rider} from "../models/rider.model";
import {SnackbarService} from "./snackbar.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user.model";
import {AppConfigService} from "./app-config.service";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    PROTOCOL = 'https://'
    PATH_ENDPOINT = '/api/users/';

    private user = new BehaviorSubject<User>({favouriteRiders: []} as any);
    private user$ = this.user.asObservable();

    private userid = "userid";

    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
        private snackBarService: SnackbarService) {
    }

    getUser():Observable<User> {
        return this.user$;
    }

    fetchUser():void {
        const requestUrl = this.PROTOCOL + this.appConfigService.getHostName() + this.PATH_ENDPOINT + this.userid;
        this.httpClient.get<User>(requestUrl).subscribe(
            (responseData: User) => this.user.next(responseData),
            error => {
                console.log('ERROR loading User data :-(', error)
            }
        )
    }


    toggleFavoriteRider(rider: Rider) {
        const indexOfRider = this.user.getValue().favouriteRiders.findIndex(riderId => riderId === rider.id);
        if (indexOfRider > -1) {
            this.user.getValue().favouriteRiders.splice(indexOfRider, 1)
            this.user.next(this.user.getValue());
            this.snackBarService.send(`You'll no longer get updated about "${rider.nickName}"!`, "success");
        } else {
            this.user.next({...this.user.getValue(), favouriteRiders: [...this.user.getValue().favouriteRiders, rider.id]});
            this.snackBarService.send(`You'll get updated about ${rider.nickName}!`, "success");
        }
    }

    getFavoriteRiders() {
        return this.user$.pipe(map(user => user.favouriteRiders));
    }
}
