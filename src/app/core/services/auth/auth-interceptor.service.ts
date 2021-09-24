import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {UserService} from "../user.service";
import {exhaustMap, take} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private userService: UserService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method === 'GET'
            || req.url.split("/").includes("login")
            || req.url.split("/").includes("register")) {
            return next.handle(req);
        } else {
            return this.userService.getUser().pipe(
                take(1),
                exhaustMap(user => {
                    if (!user.isAuthenticated) {
                        return throwError("No Auth included");
                    } else {
                        let modifiedRequest = req.clone({
                            headers: req.headers.set('Authorization', `Bearer ${user.token}`)
                                .append('Access-Control-Allow-Origin', '*')
                        });
                        return next.handle(modifiedRequest);
                    }
                })
            )
        }
    }
}
