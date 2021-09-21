import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UserNotification} from "../../../models/user-notification.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {UserNotificationService} from "../../../services/user-notification.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'rs-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('dialogTemplate') dialogTemplateRef !: TemplateRef<any>;
    @ViewChild('dialogContent') dialogContentRef !: ElementRef;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    notificationSubscription?: Subscription;
    userNotifications = new MatTableDataSource<UserNotification>([]);

    get newNotifications(): number {
        return this.userNotifications.data.filter(m => !m.read).length;
    }

    constructor(private dialog: MatDialog, private notificationService: UserNotificationService) {
    }

    ngOnInit(): void {
        this.notificationSubscription = this.notificationService.getNotification().subscribe((notification) => {
            this.userNotifications.data.splice(0, 0, notification);
            this.userNotifications.data = [...this.userNotifications.data];
            this.userNotifications.paginator = this.paginator;
        });
    }

    ngOnDestroy(): void {
        this.notificationSubscription?.unsubscribe();
    }

    ngAfterViewInit(): void {
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
