import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RiderCardComponent} from "./rider-card/rider-card.component";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {CarouselComponent, CarouselItemDirective} from "./carousel/carousel.component";
import {ErrorComponent} from "./error/error.component";
import {SlugifyPipe} from "./pipes/slugify.pipe";
import {HammerModule} from "@angular/platform-browser";
import {RiderColorPipe} from "./pipes/rider-color.pipe";
import {FavoriteRiderComponent} from './favorite-rider/favorite-rider.component';
import {MatButtonModule} from "@angular/material/button";
import {DivisionColorPipe} from './pipes/division-color.pipe';


@NgModule({
    declarations: [
        CarouselComponent,
        CarouselItemDirective,
        ErrorComponent,
        RiderCardComponent,
        SlugifyPipe,
        RiderColorPipe,
        FavoriteRiderComponent,
        DivisionColorPipe
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
        SlugifyPipe,
        RiderColorPipe,
        FavoriteRiderComponent,
        DivisionColorPipe
    ]
})
export class SharedModule {
}
