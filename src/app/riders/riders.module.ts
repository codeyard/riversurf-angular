import {AgePipe} from "./rider-profile/rider-overview/age.pipe";
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {NgModule} from '@angular/core';
import {RiderOverviewComponent} from "./rider-profile/rider-overview/rider-overview.component";
import {RiderProfileComponent} from "./rider-profile/rider-profile.component";
import {RiderTimeLineComponent} from "./rider-profile/rider-timeline/rider-time-line.component";
import {RidersComponent} from "./riders.component";
import {RidersRoutingModule} from "./riders-routing.module";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {TimeLineComponent} from "./rider-profile/rider-timeline/time-line/time-line.component";


@NgModule({
    declarations: [
        AgePipe,
        RiderOverviewComponent,
        RiderProfileComponent,
        RiderTimeLineComponent,
        RidersComponent,
        TimeLineComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        RidersRoutingModule,
        RouterModule,
        SharedModule,
    ],
    exports: [
        RidersComponent
    ]
})
export class RidersModule {
}
