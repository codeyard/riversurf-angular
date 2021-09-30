import {A11yModule} from "@angular/cdk/a11y";
import {CommonModule} from '@angular/common';
import {GoogleMapsModule} from "@angular/google-maps";
import {HeaderComponent} from "./header/header.component";
import {HomeComponent} from "./home/home.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NavigationComponent} from "./header/navigation/navigation.component";
import {NewUserNotificationsPipe} from './header/navigation/notification/new-user-notifications.pipe';
import {NgModule} from '@angular/core';
import {NotificationComponent} from './header/navigation/notification/notification.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";


@NgModule({
    declarations: [
        HeaderComponent,
        HomeComponent,
        NavigationComponent,
        NewUserNotificationsPipe,
        NotificationComponent
    ],
    imports: [
        A11yModule,
        CommonModule,
        GoogleMapsModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule,
    ],
    exports: [
        HeaderComponent
    ]
})
export class CoreModule {
}
