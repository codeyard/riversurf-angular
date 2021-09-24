import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'rs-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent implements OnInit, OnDestroy{
    @ViewChild('navigationToggler', {static: false}) navigationToggler!: ElementRef;
    isChecked = false;
    authSubscription!: Subscription;
    loggedIn = false;

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.authSubscription = this.userService.getUser().subscribe(user => {
            this.loggedIn = !!user.isAuthenticated;
        })
    }

    toggleScrolling(isFromMenu: boolean): void {

        if (isFromMenu) {
            this.isChecked = false;
            document.body.style.overflow = 'visible';
        }

        if (!isFromMenu && !this.isChecked) {
            this.isChecked = true;
            document.body.style.overflow = 'hidden';
        }

        if (!isFromMenu && this.isChecked) {
            document.body.style.overflow = 'visible';
        }
    }

    logout() {
        this.userService.logout();
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }

}
