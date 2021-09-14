import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "./header/header.component";
import {NavigationComponent} from "./header/navigation/navigation.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import { NotificationComponent } from './header/navigation/notification/notification.component';
import {MatBadgeModule} from "@angular/material/badge";


@NgModule({
    declarations: [
        HeaderComponent,
        NavigationComponent,
        NotificationComponent
    ],
    imports: [
        CommonModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatIconModule,
        RouterModule,
        MatBadgeModule
    ],
    exports: [
        HeaderComponent
    ]
})
export class CoreModule {
}
