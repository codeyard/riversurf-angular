import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Rider} from "../models/rider.model";
import {SnackbarService} from "./snackbar.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthResponseData, AuthUser, User} from "../models/user.model";
import {AppConfigService} from "./app-config.service";
import {catchError, map, tap} from "rxjs/operators";
import {Role} from "../models/role.type";
import {Router} from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    PROTOCOL = 'https://'
    PATH_ENDPOINT = '/api/user/login';
    private favoriteRiders = new BehaviorSubject<User>({favouriteRiders: []} as any);
    private favoriteRiders$ = this.favoriteRiders.asObservable();
    private tokenExpirationTimer: any;
    user = new BehaviorSubject<AuthUser | null>(null)


    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
        private snackBarService: SnackbarService,

        private router: Router) {
    }

    //TODO THIS METHOD NEEDED?
    getUser(): Observable<User> {
        return this.favoriteRiders$;
    }

    loginUser(username: string, password: string) {
        const requestUrl = this.PROTOCOL + this.appConfigService.getHostName() + this.PATH_ENDPOINT;
        const body = {userName: username, password: password}
        return this.httpClient.post<AuthResponseData>(requestUrl, body)
            .pipe(
                catchError(err => this.handleError(err)),
                tap(resData => {
                    this.handleAuthentication(resData.email, resData.userName, resData.id, resData.userRole, resData.token)
                }))

    }

    toggleFavoriteRider(rider: Rider) {
        const indexOfRider = this.favoriteRiders.getValue().favouriteRiders.findIndex(riderId => riderId === rider.id);
        if (indexOfRider > -1) {
            this.favoriteRiders.getValue().favouriteRiders.splice(indexOfRider, 1)
            this.favoriteRiders.next(this.favoriteRiders.getValue());
            this.snackBarService.send(`You'll no longer get updated about "${rider.nickName}"!`, "success");
        } else {
            this.favoriteRiders.next({
                ...this.favoriteRiders.getValue(),
                favouriteRiders: [...this.favoriteRiders.getValue().favouriteRiders, rider.id]
            });
            this.snackBarService.send(`You'll get updated about "${rider.nickName}"!`, "success");
        }
    }

    getFavoriteRiders() {
        return this.favoriteRiders$.pipe(map(user => user.favouriteRiders));
    }

    private handleAuthentication(email: string, userName: string, userId: string, role: Role, token: string) {
        this.startAutologout(token);
        const user = new AuthUser(userId, userName, email, role, token)
        this.user.next(user);
        localStorage.setItem("userData", JSON.stringify(user));
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
    }

    logout() {
        localStorage.removeItem("userData");
        this.user.next(null);
        this.snackBarService.send("We logged you out mate!", "success")
        if(this.tokenExpirationTimer) {
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
        if(!userData) {
            return
        }
        const user = new AuthUser(userData.id, userData.userName, userData.email, <"organizer" | "judge" | "rider"> userData.userRole, userData.tokenId);

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
