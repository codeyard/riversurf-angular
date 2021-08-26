import {NgModule} from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {HomeComponent} from './views/home/home.component';
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {EventCardComponent} from './views/home/event-card/event-card.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatMenuModule} from "@angular/material/menu";
import {WeatherComponent} from "./common/weather/weather.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {HttpClientModule} from "@angular/common/http";
import {NavigationComponent} from './common/header/navigation/navigation.component';
import {SignupFormComponent} from './common/signup-form/signup-form.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {RiderCardComponent} from "./common/rider-card/rider-card.component";
import {EventComponent} from "./views/event/event.component";
import {ErrorComponent} from "./views/error/error.component";
import {RiderProfileComponent} from "./views/riders/rider-profile/rider-profile.component";
import {LoginComponent} from "./views/login/login.component";
import {RidersComponent} from "./views/riders/riders.component";
import {CompetitionComponent} from "./views/competition/competition.component";
import {HeaderComponent} from "./common/header/header.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {CarouselComponent, CarrousellItemDirective} from './common/carousel/carousel.component';
import {CarouselItemComponent} from './common/carousel/carousel-item/carousel-item.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        EventCardComponent,
        RiderCardComponent,
        EventComponent,
        RidersComponent,
        RiderProfileComponent,
        LoginComponent,
        CompetitionComponent,
        ErrorComponent,
        NavigationComponent,
        SignupFormComponent,
        WeatherComponent,
        HeaderComponent,
        CarouselComponent,
        CarrousellItemDirective,
        CarouselItemComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatDividerModule,
        MatIconModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatChipsModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatGridListModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
        MatTabsModule,
        MatSnackBarModule,
        MatButtonToggleModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        HammerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
