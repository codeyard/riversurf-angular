import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { HomeComponent } from './views/home/home.component';
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import { EventCardComponent } from './views/home/event-card/event-card.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { RiderCardComponent } from './common/rider-card/rider-card.component';
import { EventComponent } from './views/event/event.component';
import { RidersComponent } from './views/riders/riders.component';
import { RiderProfileComponent } from './views/riders/rider-profile/rider-profile.component';
import { RegisterComponent } from './views/register/register.component';
import { LoginComponent } from './views/login/login.component';
import { CompetitionComponent } from './views/competition/competition.component';
import { ErrorComponent } from './views/error/error.component';
import { HeaderComponent } from './common/header/header.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatMenuModule} from "@angular/material/menu";
import { NavigationComponent } from './common/header/navigation/navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventCardComponent,
    RiderCardComponent,
    EventComponent,
    RidersComponent,
    RiderProfileComponent,
    RegisterComponent,
    LoginComponent,
    CompetitionComponent,
    ErrorComponent,
    HeaderComponent,
    NavigationComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatDividerModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatChipsModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatMenuModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
