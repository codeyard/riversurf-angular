import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Rider} from "../models/rider.model";
import {SnackbarService} from "./snackbar.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {User} from "../models/user.model";
import {AppConfigService} from "./app-config.service";
import {catchError, map, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {JwtHelperService} from '@auth0/angular-jwt';
import * as uuid from 'uuid';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    PROTOCOL = 'https://'
    PATH_ENDPOINT = '/api/user/login';
    private tokenExpirationTimer: any;

    // initial user will be persisted in indexed DB if not logged in
    private initialUser = {id: uuid.v4(), favouriteRiders: [], isAuthenticated: false}
    private user = new BehaviorSubject<User>(this.initialUser);
    private user$ = this.user.asObservable();


    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
        private snackBarService: SnackbarService,
        private router: Router) {
    }

    getUser(): Observable<User> {
        return this.user$;
    }

    loginUser(username: string, password: string) {
        const requestUrl = this.PROTOCOL + this.appConfigService.getHostName() + this.PATH_ENDPOINT;
        const body = {userName: username, password: password}
        return this.httpClient.post<User>(requestUrl, body)
            .pipe(
                catchError(err => this.handleError(err)),
                tap(resData => {
                    const user: User = {
                        id: resData.id,
                        userName: resData.userName,
                        email: resData.email,
                        userRole: resData.userRole,
                        token: resData.token,
                        favouriteRiders: resData.favouriteRiders ?? [],
                        isAuthenticated: true
                    }
                    this.handleAuthentication(user)
                }))

    }

    toggleFavoriteRider(rider: Rider) {
        const indexOfRider = this.user.getValue().favouriteRiders.findIndex(riderId => riderId === rider.id);
        const riders = this.user.getValue().favouriteRiders;
        if (indexOfRider > -1) {
            riders.splice(indexOfRider, 1);
            const user = {
                ...this.user.getValue(),
                favouriteRiders: riders
            };
            this.user.next(user);
            this.snackBarService.send(`We'll keep you updated about "${rider.firstName} ${rider.lastName}"!`, "success");
        } else {
            riders.push(rider.id)
            const user = {
                ...this.user.getValue(),
                favouriteRiders: riders
            };
            this.user.next(user);
            this.snackBarService.send(`We won't update you about"${rider.firstName} ${rider.lastName}" anymore!`, "success");
        }
    }

    getFavoriteRiders() {
        return this.user$.pipe(map(user => user.favouriteRiders));
    }

    private handleAuthentication(user: User) {
        this.startAutologout(user.token!);
        this.user.next(user);
        localStorage.setItem("userData", JSON.stringify(user));
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
    }

    logout() {
        localStorage.removeItem("userData");
        this.user.next(this.initialUser);
        this.snackBarService.send("We logged you out mate!", "success")
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer)
        }
        this.tokenExpirationTimer = null;
        this.router.navigate(["/"]);
    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            tokenId: string,
            userName: string,
            userRole: string
        } = JSON.parse(<string>localStorage.getItem("userData"))
        if (!userData) {
            return
        }
        const user: User = {
            id: userData.id,
            userName: userData.userName,
            email: userData.email,
            userRole: <"organizer" | "judge" | "rider">userData.userRole,
            token: userData.tokenId,
            favouriteRiders: [],
            isAuthenticated: true
        };

        if (user.token) {
            this.user.next(user);
            this.startAutologout(userData.tokenId)
        }


    }

    startAutologout(token: string) {
        const helper = new JwtHelperService();
        const expirationDate = helper.getTokenExpirationDate(token);
        let expirationTime = 1000;
        if (expirationDate != null) {
            expirationTime = expirationDate.getTime() - new Date().getTime();
        }
        this.autoLogout(expirationTime);
    }

    handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = "This didn't work mate... Try Again!";
        if (!errorResponse.error) {
            return throwError(errorMessage);
        }
        switch (errorResponse.error) {
            case "Forbidden":
                errorMessage = "Your Credentials seem not be correct"
                break;
            case "No User found":
                errorMessage = "r u sure about the username?"
                // TODO IMPLEMENT IN BACKEND?
                break;
        }
        return throwError(errorMessage);
    }
}
