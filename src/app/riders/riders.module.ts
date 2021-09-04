import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RidersComponent} from "./riders.component";
import {RiderProfileComponent} from "./rider-profile/rider-profile.component";
import {RiderOverviewComponent} from "./rider-profile/rider-overview/rider-overview.component";
import {RiderTimelineComponent} from "./rider-profile/rider-timeline/rider-timeline.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {RouterModule} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {AgePipe} from "./rider-profile/rider-overview/age.pipe";
import {RidersRoutingModule} from "./riders-routing.module";
import {SharedModule} from "../shared/shared.module";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
    declarations: [
        RidersComponent,
        RiderProfileComponent,
        RiderOverviewComponent,
        RiderTimelineComponent,
        AgePipe
    ],
    imports: [
        RidersRoutingModule,
        SharedModule,
        CommonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        RouterModule,
        MatTabsModule,
        MatCardModule,
        MatButtonModule
    ],
    exports: [
        RidersComponent
    ]
})
export class RidersModule {
}
