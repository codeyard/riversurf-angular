import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UserNotification} from "../../../models/user-notification.model";

@Component({
    selector: 'rs-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

    @ViewChild('dialogTemplate') dialogTemplateRef !: TemplateRef<any>;
    @ViewChild('dialogContent') dialogContentRef !: ElementRef;

    userNotifications: UserNotification[] = [];

    get newNotifications() : number{
        return this.userNotifications.filter(m => !m.read).length;
    }

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
        const dialog = this.dialog.open(this.dialogTemplateRef, {
            closeOnNavigation: true,
            autoFocus: false
        });
        dialog.afterOpened().subscribe(() => {
            this.dialogContentRef.nativeElement.scrollTop = this.dialogContentRef.nativeElement.scrollHeight;
        });
    }

    clearUnreadMessages() {
        this.userNotifications.forEach(e=>e.read = true);
    }

    private pushDemoMessage(){
        this.userNotifications = [...this.userNotifications, {
            timestamp: new Date(),
            content: 'Hello World',
            read: false,
            link: this.userNotifications.length % 2 === 0 ? 'event/riversurf-jam-thun-2021' : undefined
        }];
    }

    markAsRead(element : UserNotification) {
        element.read = true;
    }
}
