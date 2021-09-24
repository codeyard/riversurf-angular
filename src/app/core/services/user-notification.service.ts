import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {IncomingNotification} from "../models/websocket/incoming-notification.model";

@Injectable({
    providedIn: 'root'
})
export class UserNotificationService {

    private notificationData = new Subject<IncomingNotification>();
    private notification$ = this.notificationData.asObservable();

    constructor() {
    }

    getNotification(): Observable<IncomingNotification> {
        return this.notification$;
    }

    showNotification(notification: IncomingNotification) {
        this.notificationData.next(notification);
    }
}
