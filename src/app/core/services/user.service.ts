import {Injectable} from '@angular/core';
import {BehaviorSubject, noop, Observable, throwError} from "rxjs";
import {Rider} from "../models/rider.model";
import {SnackbarService} from "./snackbar.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {User} from "../models/user.model";
import {AppConfigService} from "./app-config.service";
import {catchError, distinctUntilChanged, filter, map, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {JwtHelperService} from '@auth0/angular-jwt';
import {DexieService} from "./dexie.service";


@Injectable({
    providedIn: 'root'
})
export class UserService {

    PROTOCOL = 'https://';
    PATH_LOGIN = '/api/user/login';
    PATH_PUT = '/api/user';

    ANONYMOUS = "anonymous";

    private tokenExpirationTimer: any;

    // initial user will be persisted in indexed DB if not logged in
    private initialUser = {id: "anonymous", favouriteRiders: [], isAuthenticated: false}
    private user = new BehaviorSubject<User>(this.initialUser);
    private user$ = this.user.asObservable();

    private dexieDB: any;


    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
        private snackBarService: SnackbarService,
        private router: Router,
        private dexieService: DexieService
    ) {

        // wenn User ändert -> store to indexedDB

        //Get Initial User fom DB if exists
        this.dexieDB = dexieService.getDB();
        this.dexieDB.users.toArray().then((users: User[]) => {
            if (users.length > 0) {
                const authuser = users.filter(user => user.isAuthenticated)[0];
                if (authuser !== undefined) {
                    // log in with stored token
                    this.autoLogin(authuser);
                    this.user.next(authuser);
                } else {
                    const user = users.filter(user => !user.isAuthenticated)[0];
                    this.user.next(user)
                }
            }
            this.subScribeToUserChanges();
        });
    }

    getUser(): Observable<User> {
        return this.user$;
    }

    public loginUser(username: string, password: string) {
        const requestUrl = this.PROTOCOL + this.appConfigService.getHostName() + this.PATH_LOGIN;
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

    public toggleFavoriteRider(rider: Rider) {
        const indexOfRider = this.user.getValue().favouriteRiders.findIndex(riderId => riderId === rider.id);
        const riders = [...this.user.getValue().favouriteRiders];
        if (indexOfRider > -1) {
            riders.splice(indexOfRider, 1);
            const user = {
                ...this.user.getValue(),
                favouriteRiders: riders
            };
            this.user.next(user);
            this.snackBarService.send(`We won't update you about "${rider.firstName} ${rider.lastName}" anymore!`, "success");
        } else {
            riders.push(rider.id)
            const user = {
                ...this.user.getValue(),
                favouriteRiders: riders
            };
            this.user.next(user);
            this.snackBarService.send(`We'll keep you updated about "${rider.firstName} ${rider.lastName}"!`, "success");
        }
    }

    public getFavoriteRiders() {
        return this.user$.pipe(map(user => user.favouriteRiders));
    }

    public logout(route?: string) {
        const navigateTo = route ?? "/";
        this.setAnonymousUser();
        this.snackBarService.send("We logged you out mate!", "success")
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer)
        }
        this.tokenExpirationTimer = null;
        this.router.navigate([navigateTo]);
    }

    private putUser(user: User): void {
        this.dexieDB.users.put(user);
        if(user.isAuthenticated) {
            const requestUrl = this.PROTOCOL + this.appConfigService.getHostName() + this.PATH_PUT;
            const body = user
            this.httpClient.put<User>(requestUrl, body).subscribe(() => noop())
        }
    }

    private handleAuthentication(user: User) {
        this.startAutologout(user.token!);
        user.isAuthenticated = true;
        this.user.next(user);
    }

    private autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => this.logout("/login"), expirationDuration);
    }

    autoLogin(user: User) {
        if (user.token && !(new JwtHelperService().isTokenExpired(user.token))) {
            this.startAutologout(user.token);
            user.isAuthenticated = true;
            this.user.next(user);
        }
    }

    private startAutologout(token: string): void {
        const helper = new JwtHelperService();
        const expirationDate = helper.getTokenExpirationDate(token);
        let expirationTime = 1000;
        if (expirationDate != null) {
            expirationTime = expirationDate.getTime() - new Date().getTime();
        }
        this.autoLogout(expirationTime);
    }

    private handleError(errorResponse: HttpErrorResponse) {
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

    private subScribeToUserChanges() {
        this.user$
            .pipe(
                filter(user => user !== undefined),
                distinctUntilChanged((prevUser, nextUser) => this.isUserEqal(prevUser, nextUser))
            )
            .subscribe(user => {
                this.putUser(user)
            })
    }

    private setAnonymousUser(): void {this.dexieDB.users.toArray().then((users: User[]) => {
            const user = users.filter(user => user.id === this.ANONYMOUS)[0];
            this.user.next(user);
        });
    }

    private setAuthenticatedUser(isLoggedIn: boolean): void {
        this.dexieDB.users.toArray().then((users: User[]) => {
            const user = users.filter(user => user.id !== this.ANONYMOUS)[0];
            user.isAuthenticated = isLoggedIn;
            this.user.next(user);
        })
    }

    private isUserEqal(prevUser: User, nextUser: User): boolean {
        return prevUser.id === nextUser.id &&
            prevUser.token === nextUser.token &&
            prevUser.isAuthenticated === nextUser.isAuthenticated &&
            // to simplify we check the length -> can not get rid or add two riders at the same time...
            prevUser.favouriteRiders.length === nextUser.favouriteRiders.length &&
            prevUser.email === nextUser.email &&
            prevUser.userName === nextUser.userName &&
            prevUser.userRole === nextUser.userRole &&
            prevUser.profile === nextUser.profile;
    }
}
