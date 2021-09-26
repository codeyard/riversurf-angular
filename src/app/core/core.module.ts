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
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";


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
        A11yModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatInputModule
    ],
    exports: [
        HeaderComponent
    ]
})
export class CoreModule {
}
