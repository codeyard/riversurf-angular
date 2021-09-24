import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, zip} from 'rxjs';
import {UserService} from "../user.service";
import {SnackbarService} from "../snackbar.service";
import {map} from "rxjs/operators";
import {SurfEventService} from "../surf-event.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router, private snackBarService: SnackbarService, private surfEventService: SurfEventService) {
    }

    getUser() {
        return this.userService.getUser();
    }

    getSurfEvent(id: string) {
        return this.surfEventService.getSurfEvent(id);
    }


    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const isAdministratorRoute = route.url.toString().split("/")[0].split(",").includes("edit")
        const id = route.params['id'].split('-').pop();
        return zip(this.getUser(), this.getSurfEvent(id)).pipe(
            map(([user, surfEvent]) => {
                if (user.isAuthenticated) {
                    if (isAdministratorRoute && user) {
                        if (surfEvent?.judge === user.id || surfEvent?.organizer === user.id) {
                            this.snackBarService.send("Hold on a second while we grab the data for you!", "success");
                            return true;
                        } else {
                            console.log("NOT JUDGE OR ORGANIZER OF EVENT!")
                            this.snackBarService.send("Fella, you don't have the right permission to do that!", "error");
                            return this.router.createUrlTree(["/"]);
                        }
                    } else {
                        this.snackBarService.send("Hold on a second while we grab the data for you!!!", "success");
                        return true;
                    }
                } else {
                    this.snackBarService.send("Fella, you need to login first!", "error");
                    return this.router.createUrlTree(["/login"]);
                }
            })
        )
    }


}
