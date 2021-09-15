import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UserNotification} from "../../../models/user-notification.model";

@Component({
    selector: 'rs-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

    @ViewChild('content') dialogContent !: TemplateRef<any>;

    userNotifications: UserNotification[] = [];

    constructor(private dialog: MatDialog) {
    }

    ngOnInit(): void {
        setInterval(()=>this.pushDemoMessage(), 2000);
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
        this.userNotifications = [...this.userNotifications];
    }

    private pushDemoMessage(){
        this.userNotifications = [...this.userNotifications, {
            timestamp: new Date(),
            content: 'Hello World',
            read: false,
            link: this.userNotifications.length % 2 === 0 ? 'event/riversurf-jam-thun-2021' : undefined
        }];
        console.log(`Added message`);
    }
}
