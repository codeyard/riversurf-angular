import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {UserNotification} from "../models/user-notification.model";

@Injectable({
    providedIn: 'root'
})
export class UserNotificationService {

    private notificationData = new Subject<UserNotification>();
    private notification$ = this.notificationData.asObservable();

    constructor() {
    }

    getNotification(): Observable<UserNotification> {
        return this.notification$;
    }

    showNotification(notification: UserNotification) {
        this.notificationData.next(notification);
    }
}
