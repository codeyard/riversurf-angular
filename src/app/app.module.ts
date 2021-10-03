import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppConfigService} from "./core/services/app-config.service";
import {AppRoutingModule} from './app-routing.module';
import {AuthInterceptorService} from "./core/services/auth/auth-interceptor.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {CoreModule} from "./core/core.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./shared/shared.module";
import {SlugifyPipe} from "./shared/pipes/slugify.pipe";
import {UserModule} from "./user/user.module";
import {loadInitialData} from "./init";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CoreModule,
        HammerModule,
        HttpClientModule,
        SharedModule,
        UserModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the app is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        }),
    ],
    providers: [{
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: loadInitialData,
        deps: [AppConfigService]
    }, {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true
    }, SlugifyPipe],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
