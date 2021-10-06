import {CarouselComponent, CarouselItemDirective} from "./carousel/carousel.component";
import {CommonModule} from '@angular/common';
import {DivisionColorPipe} from './pipes/division-color.pipe';
import {DivisionIconPipe} from './pipes/division-icon.pipe';
import {ErrorComponent} from "./error/error.component";
import {EventCardComponent} from "./event-card/event-card.component";
import {FavoriteRiderComponent} from './favorite-rider/favorite-rider.component';
import {HammerModule} from "@angular/platform-browser";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {NgModule} from '@angular/core';
import {RiderCardComponent} from "./rider-card/rider-card.component";
import {RiderColorPipe} from "./pipes/rider-color.pipe";
import {RouterModule} from "@angular/router";
import {SlugifyPipe} from "./pipes/slugify.pipe";


@NgModule({
    declarations: [
        CarouselComponent,
        CarouselItemDirective,
        DivisionColorPipe,
        DivisionIconPipe,
        ErrorComponent,
        EventCardComponent,
        FavoriteRiderComponent,
        RiderCardComponent,
        RiderColorPipe,
        SlugifyPipe,
        DivisionIconPipe
    ],
    imports: [
        CommonModule,
        HammerModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        RouterModule
    ],
    exports: [
        CarouselComponent,
        CarouselItemDirective,
        DivisionColorPipe,
        DivisionIconPipe,
        EventCardComponent,
        ErrorComponent,
        FavoriteRiderComponent,
        RiderCardComponent,
        RiderColorPipe,
        SlugifyPipe
    ]
})
export class SharedModule {
}
