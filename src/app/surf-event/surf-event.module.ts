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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {RoundComponent} from './surf-event/competition/round/round.component';
import {RiderResultComponent} from "./surf-event/competition/round/rider-result/rider-result.component";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {HeatComponent} from './surf-event/competition/round/heat/heat.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {GoogleMapsModule} from "@angular/google-maps";
import {ResultViewComponent} from './result-view/result-view.component';
import {ProgressLineComponent} from './result-view/progress-line/progress-line.component';
import {QrCodeModule} from "ng-qrcode";
import { WeatherIconPipe } from './weather/weather-icon.pipe';
import { WeatherConditionPipe } from './weather/weather-condition.pipe';


@NgModule({
    declarations: [
        SurfEventComponent,
        CompetitionComponent,
        WeatherComponent,
        RoundComponent,
        RiderResultComponent,
        HeatComponent,
        ResultViewComponent,
        ProgressLineComponent,
        WeatherIconPipe,
        WeatherConditionPipe
    ],
    imports: [
        SurfEventRoutingModule,
        CommonModule,
        SharedModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatGridListModule,
        MatIconModule,
        MatChipsModule,
        FormsModule,
        ReactiveFormsModule,
        DragDropModule,
        MatButtonModule,
        MatTabsModule,
        MatFormFieldModule,
        GoogleMapsModule,
        QrCodeModule
    ]
})
export class SurfEventModule {
}
