import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {IncomingNotification} from "../models/websocket/incoming-notification.model";
import {tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UserNotificationService {
    private notificationData = new Subject<IncomingNotification>();
    private notifiedNotificationData = new Subject<IncomingNotification>();
    private notification$ = this.notifiedNotificationData.asObservable();
    private readonly hasVibrationSupport;
    private readonly hasNotificationSupport;
    private hasGrantedNotificationSupport;

    constructor() {
        this.hasVibrationSupport = !!window.navigator.vibrate;
        this.hasNotificationSupport = !!window.Notification;
        if (this.hasNotificationSupport) {
            this.hasGrantedNotificationSupport = Notification.permission === "granted";
            if (!this.hasGrantedNotificationSupport) {
                Notification.requestPermission().then(() => {
                    this.hasGrantedNotificationSupport = Notification.permission === "granted";
                });
            }
        }
        this.notificationData.pipe(
            tap(val => {
                if (this.hasNotificationSupport && this.hasGrantedNotificationSupport) {
                    try {
                        const notification = new Notification('RiverSurf', {
                            body: val.content,
                            tag: val.surfEventName,
                            icon: '/assets/icons/icon-256x256.png',
                            vibrate: 400
                        });
                    } catch {
                        if (this.hasVibrationSupport) {
                            window.navigator.vibrate(400);
                        }
                    }
                } else {
                    if (this.hasVibrationSupport) {
                        window.navigator.vibrate(400);
                    }
                }
            })
        ).subscribe(val => {
            this.notifiedNotificationData.next(val);
        });
    }

    getNotification(): Observable<IncomingNotification> {
        return this.notification$;
    }

    showNotification(notification: IncomingNotification) {
        this.notificationData.next(notification);
    }
}
