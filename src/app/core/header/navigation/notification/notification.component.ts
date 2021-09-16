import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UserNotification} from "../../../models/user-notification.model";

@Component({
    selector: 'rs-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

    @ViewChild('content') dialogContent !: TemplateRef<any>;

    userNotifications: UserNotification[] = [];
    newNotifications : number = 0;

    private intervalId: number = 0;

    constructor(private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.intervalId = setInterval(()=>this.pushDemoMessage(), 2000);
    }


    ngOnDestroy(): void {
        if(this.intervalId != 0) {
            clearInterval(this.intervalId);
        }
    }

    openDialog() {
        this.dialog.open(this.dialogContent, {closeOnNavigation: true}).afterClosed().subscribe(()=>this.clearUnreadMessages());
    }

    private clearUnreadMessages() {
        // this.userNotifications.forEach((element, index) => {
        //     element.read = true;
        //     this.userNotifications[index] = element;
        // });
        this.userNotifications.forEach(e=>e.read = true);
        this.refreshNotificationCounter();
    }

    private pushDemoMessage(){
        this.userNotifications.push({
            timestamp: new Date(),
            content: 'Hello World',
            read: false,
            link: this.userNotifications.length % 2 === 0 ? 'event/riversurf-jam-thun-2021' : undefined
        });
        this.refreshNotificationCounter();
    }

    private refreshNotificationCounter(){
        this.newNotifications = this.userNotifications.filter(m => !m.read).length;
    }

}
