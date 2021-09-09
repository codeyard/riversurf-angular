import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Rider} from "../models/rider.model";
import {SnackbarService} from "./snackbar.service";
import {RidersService} from "./riders.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private favoriteRiders = new BehaviorSubject<Rider[]>([]);

    constructor(private snackBarService: SnackbarService, private riderService: RidersService) {
    }


    toggleFavoriteRider(rider: Rider) {
        const indexOfRider = this.favoriteRiders.value.findIndex(elementRider => elementRider.id === rider.id);
        if (indexOfRider > -1) {
            this.favoriteRiders.getValue().splice(indexOfRider, 1)
            this.favoriteRiders.next(this.favoriteRiders.getValue());
            this.snackBarService.send(`You'll no longer get updated about "${rider.nickName}"!`, "success");
        } else {
            this.favoriteRiders.next([...this.favoriteRiders.value, rider]);
            this.snackBarService.send(`You'll get updated about ${rider.nickName}!`, "success");
        }
    }

    getFavoriteRiders() {
        return this.favoriteRiders;
    }
}
