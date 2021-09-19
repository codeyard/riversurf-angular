import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UserNotification} from "../../../models/user-notification.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'rs-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('dialogTemplate') dialogTemplateRef !: TemplateRef<any>;
    @ViewChild('dialogContent') dialogContentRef !: ElementRef;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    userNotifications = new MatTableDataSource<UserNotification>([]);

    get newNotifications(): number {
        return this.userNotifications.data.filter(m => !m.read).length;
    }

    private intervalId: number = 0;

    constructor(private dialog: MatDialog) {
    }

    ngOnInit(): void {
        // ToDo: Replace with subscribing to notification service for receiving messages
        this.intervalId = setInterval(() => this.pushDemoMessage(), 2000);
    }

    ngOnDestroy(): void {
        if (this.intervalId != 0) {
            clearInterval(this.intervalId);
        }
    }

    ngAfterViewInit(): void {
        this.userNotifications.paginator = this.paginator;
    }

    private pushDemoMessage() {
        this.userNotifications.data.splice(0, 0, {
            timestamp: new Date(),
            content: 'Hello World',
            read: false,
            link: this.userNotifications.data.length % 2 === 0 ? 'event/riversurf-jam-thun-2021' : undefined
        });
        this.userNotifications.data = [...this.userNotifications.data];
        this.userNotifications.paginator = this.paginator;
    }

    openDialog() {
        const dialog = this.dialog.open(this.dialogTemplateRef, {
            closeOnNavigation: true,
            autoFocus: false,
            width: '100vw'
        });
        dialog.afterOpened().subscribe(() => this.userNotifications.paginator = this.paginator);
    }

    markAsRead(element: UserNotification) {
        element.read = true;
    }

    markAllAsRead() {
        this.userNotifications.data.forEach(e => e.read = true);
    }

    clearAllMessages() {
        this.userNotifications.data = [];
        this.userNotifications.paginator = this.paginator;
    }

}
