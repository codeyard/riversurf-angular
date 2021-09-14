import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'rs-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

    @ViewChild('content') dialogContent !: TemplateRef<any>;

    unread:number = 99;

    constructor(private dialog: MatDialog) {
    }

    ngOnInit(): void {
    }

    openDialog() {
        this.dialog.open(this.dialogContent).afterClosed().subscribe(()=>this.unread = 0);
    }
}
