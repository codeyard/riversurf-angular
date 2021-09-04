import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./views/home/home.component";
import {RiderProfileComponent} from "./views/riders/rider-profile/rider-profile.component";
import {RidersComponent} from "./views/riders/riders.component";
import {LoginComponent} from "./views/login/login.component";
import {ErrorComponent} from "./views/error/error.component";

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {
        path: 'event',
        loadChildren: () => import('./surf-event/surf-event.module').then(m => m.SurfEventModule)
    },
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
