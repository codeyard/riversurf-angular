import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "./header/header.component";
import {NavigationComponent} from "./header/navigation/navigation.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {NotificationComponent} from './header/navigation/notification/notification.component';
import {MatBadgeModule} from "@angular/material/badge";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {NewUserNotificationsPipe} from './header/navigation/notification/new-user-notifications.pipe';


@NgModule({
    declarations: [
        HeaderComponent,
        NavigationComponent,
        NotificationComponent,
        NewUserNotificationsPipe
    ],
    imports: [
        CommonModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatIconModule,
        RouterModule,
        MatBadgeModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        HeaderComponent
    ]
})
export class CoreModule {
}
