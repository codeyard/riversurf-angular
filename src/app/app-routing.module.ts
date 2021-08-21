import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./views/home/home.component";
import {EventComponent} from "./views/event/event.component";
import {RiderProfileComponent} from "./views/riders/rider-profile/rider-profile.component";
import {RidersComponent} from "./views/riders/riders.component";
import {RegisterComponent} from "./views/register/register.component";
import {LoginComponent} from "./views/login/login.component";
import {CompetitionComponent} from "./views/competition/competition.component";
import {ErrorComponent} from "./views/error/error.component";

const routes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'event/:id', component: EventComponent, children: [
            {path: 'competition/:division', component: CompetitionComponent}
        ]},
    {path: 'riders', component: RidersComponent},
    {path: 'rider/:id', component: RiderProfileComponent},
    {path: '', pathMatch: 'full', component: HomeComponent},
    {path: 'page-not-found', component: ErrorComponent},
    {path: '**', redirectTo: '/page-not-found'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
