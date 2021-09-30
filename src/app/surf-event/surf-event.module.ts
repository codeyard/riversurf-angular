import {WeatherConditionPipe} from './weather/weather-condition.pipe';
import {WeatherIconPipe} from './weather/weather-icon.pipe';
import {CommonModule} from '@angular/common';
import {CompetitionComponent} from "./surf-event/competition/competition.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GoogleMapsModule} from "@angular/google-maps";
import {HeatComponent} from './surf-event/competition/round/heat/heat.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTabsModule} from "@angular/material/tabs";
import {NgModule} from '@angular/core';
import {ProgressLineComponent} from './result-view/progress-line/progress-line.component';
import {QrCodeModule} from "ng-qrcode";
import {ResultViewComponent} from './result-view/result-view.component';
import {RiderResultComponent} from "./surf-event/competition/round/rider-result/rider-result.component";
import {RoundComponent} from './surf-event/competition/round/round.component';
import {SharedModule} from "../shared/shared.module";
import {SurfEventComponent} from "./surf-event/surf-event.component";
import {SurfEventRoutingModule} from "./surf-event-routing.module";
import {WeatherComponent} from "./weather/weather.component";


@NgModule({
    declarations: [
        CompetitionComponent,
        HeatComponent,
        ProgressLineComponent,
        ResultViewComponent,
        RiderResultComponent,
        RoundComponent,
        SurfEventComponent,
        WeatherComponent,
        WeatherConditionPipe,
        WeatherIconPipe,
    ],
    imports: [
        CommonModule,
        DragDropModule,
        FormsModule,
        GoogleMapsModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        QrCodeModule,
        ReactiveFormsModule,
        SharedModule,
        SurfEventRoutingModule,
    ]
})
export class SurfEventModule {
}
