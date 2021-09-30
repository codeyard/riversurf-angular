import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {IncomingNotification} from "../models/websocket/incoming-notification.model";
import {tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UserNotificationService {
    private notificationData = new Subject<IncomingNotification>();
    private notification$ = this.notificationData.asObservable();
    private readonly hasVibrationSupport;

    constructor() {
        this.hasVibrationSupport = !!window.navigator.vibrate;
    }

    getNotification(): Observable<IncomingNotification> {
        return this.notification$.pipe(
            tap(val =>  {
                console.log('I want some good vibrations')
                if (this.hasVibrationSupport) {
                    window.navigator.vibrate(200);
                }
            })
        );
    }

    showNotification(notification: IncomingNotification) {
        this.notificationData.next(notification);
    }
}
