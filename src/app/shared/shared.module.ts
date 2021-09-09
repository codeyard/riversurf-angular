import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RiderCardComponent} from "./rider-card/rider-card.component";
import {TimeLineComponent} from "./time-line/time-line.component";
import {TimeLineLineComponent} from "./time-line/time-line-line/time-line-line.component";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {CarouselComponent, CarouselItemDirective} from "./carousel/carousel.component";
import {ErrorComponent} from "./error/error.component";
import {SlugifyPipe} from "./pipes/slugify.pipe";
import {DivisionColorPipe} from './pipes/division-color.pipe';
import {HammerModule} from "@angular/platform-browser";
import {RiderColorPipe} from "./pipes/rider-color.pipe";
import {FavoriteRiderComponent} from './favorite-rider/favorite-rider.component';
import {MatButtonModule} from "@angular/material/button";


@NgModule({
    declarations: [
        CarouselComponent,
        CarouselItemDirective,
        ErrorComponent,
        RiderCardComponent,
        TimeLineComponent,
        TimeLineLineComponent,
        SlugifyPipe,
        DivisionColorPipe,
        RiderColorPipe,
        FavoriteRiderComponent
    ],
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        RouterModule,
        HammerModule,
        MatButtonModule
    ],
    exports: [
        CarouselComponent,
        CarouselItemDirective,
        ErrorComponent,
        RiderCardComponent,
        TimeLineComponent,
        SlugifyPipe,
        DivisionColorPipe,
        RiderColorPipe,
        FavoriteRiderComponent
    ]
})
export class SharedModule {
}
