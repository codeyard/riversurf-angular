import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, zip} from 'rxjs';
import {UserService} from "../user.service";
import {SnackbarService} from "../snackbar.service";
import {map, take} from "rxjs/operators";
import {SurfEventService} from "../surf-event.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router, private snackBarService: SnackbarService, private surfEventService: SurfEventService) {
    }

    getUser() {
        return this.userService.user.pipe(
            take(1))
    }

    getCompetition(route: ActivatedRouteSnapshot) {
        const id = route.params['id'].split('-').pop();
        return this.surfEventService.getSurfEvent(id).pipe(
            take(1)
        )
    }


    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const isAdministratorRoute = route.url.toString().split("/")[0].split(",").includes("edit")
        return zip(this.getUser(), this.getCompetition(route)).pipe(
            map((concatedUserAndSurfEvent) => {
                const user = concatedUserAndSurfEvent[0];
                const surfEvent = concatedUserAndSurfEvent[1];
                if (user !== null) {
                    if (isAdministratorRoute && user) {
                        if (surfEvent.judge === user.id || surfEvent.organizer === user.id) {
                            console.log("YOU ARE THE JUDGE OF THE EVENT OR ORGANIZER", user, surfEvent)
                            this.snackBarService.send("Hold on a second while we grab the data for you!", "success");
                            return true;
                        } else {
                            this.snackBarService.send("You are logged in, but you don't have the right permission to do that!", "error");
                            return this.router.createUrlTree(["/"]);
                            return false;
                        }
                    } else {
                        this.snackBarService.send("Hold on a second while we grab the data for you!!!", "success");
                        return true;
                    }
                } else {
                    this.snackBarService.send("Fella, you need to login first!", "error");
                    return this.router.createUrlTree(["/login"]);
                    return false;
                }
            })
        )
    }


}
