import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SurfEventComponent} from "./surf-event/surf-event.component";
import {WeatherComponent} from "./weather/weather.component";
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {SurfEventRoutingModule} from "./surf-event-routing.module";
import {CompetitionComponent} from "./surf-event/competition/competition.component";
import {SharedModule} from "../shared/shared.module";
import {MatChipsModule} from "@angular/material/chips";


@NgModule({
    declarations: [
        SurfEventComponent,
        CompetitionComponent,
        WeatherComponent
    ],
    imports: [
        SurfEventRoutingModule,
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatGridListModule,
        MatIconModule,
        SharedModule,
        MatChipsModule
    ]
})
export class SurfEventModule {
}
