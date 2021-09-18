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
import {MatTableModule} from "@angular/material/table";
import {A11yModule} from "@angular/cdk/a11y";


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
        MatButtonModule,
        MatTableModule,
        A11yModule
    ],
    exports: [
        HeaderComponent
    ]
})
export class CoreModule {
}
