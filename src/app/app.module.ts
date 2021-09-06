import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core/core.module";
import {EventCardComponent} from "./home/event-card/event-card.component";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {UserModule} from "./user/user.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {loadInitialData} from "./init";
import {AppConfigService} from "./core/services/app-config.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        EventCardComponent

    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        HttpClientModule,
        SharedModule,
        MatCardModule,
        MatChipsModule,
        UserModule,
        MatProgressSpinnerModule,
        HammerModule
    ],
    providers: [{
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: loadInitialData,
        deps: [AppConfigService]
    }],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
