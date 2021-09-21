import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {UserNotification} from "../models/user-notification.model";

@Injectable({
    providedIn: 'root'
})
export class UserNotificationService {

    private notificationData = new Subject<UserNotification>();
    private notification$ = this.notificationData.asObservable();

    // ToDo: Remove after introduction of websocket service
    private toggle: boolean = false;

    constructor() {
        // ToDo: Remove after introduction of websocket service (subscribe to websocket service)
        setInterval(() => this.sendDemoMessage(), 2000);
    }

    getNotification(): Observable<UserNotification> {
        return this.notification$;
    }

    showNotification(notification: UserNotification) {
        this.notificationData.next(notification);
    }

    // ToDo: Remove after introduction of websocket service
    private sendDemoMessage() {
        this.showNotification({
            timestamp: new Date(),
            content: 'Hello World',
            read: false,
            link: this.toggle ? 'event/riversurf-jam-thun-2021' : undefined
        });
        this.toggle = !this.toggle;
    }
}
