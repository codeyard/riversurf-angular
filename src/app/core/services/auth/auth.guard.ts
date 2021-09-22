import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "../user.service";
import {SnackbarService} from "../snackbar.service";
import {map, take} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router, private snackBarService: SnackbarService) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const isAdministratorRoute = route.url.toString().split("/").includes("/edit")
        return this.userService.user.pipe(
            take(1),
            map(user => {
                const isAuth = !!user;
                if (isAdministratorRoute && user) {
                    if (user.userRole === 'organizer' || user.userRole === 'judge') {
                        this.snackBarService.send("Hold on a second, we just grab the data for you!", "success");
                        return true;
                    } else {
                        this.snackBarService.send("You are logged in, but you don't have the right permission to do that!", "error");
                        return this.router.createUrlTree(["/"]);
                        return false;
                    }
                } else {
                    if (isAuth && user) {
                        this.snackBarService.send("Hold on a second, we just grab the data for you!", "success");
                        return true;
                    } else {
                        this.snackBarService.send("Fella, you need to be logged in to do this!", "error");
                        return this.router.createUrlTree(["/login"]);
                    }
                }

            })
        )
    }


}
