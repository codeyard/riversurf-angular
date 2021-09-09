import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {UserService} from "../../core/services/user.service";
import {map} from "rxjs/operators";
import {Rider} from "../../core/models/rider.model";

@Component({
    selector: 'rs-favorite-rider',
    templateUrl: './favorite-rider.component.html',
    styleUrls: ['./favorite-rider.component.scss']
})
export class FavoriteRiderComponent implements OnInit, OnDestroy {
    @Input() rider!: Rider;
    favoriteRiderSubscription!: Subscription;
    isFavoriteRider!: boolean;

    constructor(private userService: UserService) {


    }

    ngOnInit(): void {
        this.favoriteRiderSubscription = this.userService.getFavoriteRiders().pipe(
            map(riders => riders.filter(rider => rider.id === this.rider.id)[0]),
            map(rider => !!rider)
        ).subscribe(
            val => this.isFavoriteRider = val
        )
    }

    ngOnDestroy(): void {
        this.favoriteRiderSubscription.unsubscribe();
    }

    toggleFavorites(event: Event) {
        event.stopPropagation();
        this.userService.toggleFavoriteRider(this.rider)
    }

}
