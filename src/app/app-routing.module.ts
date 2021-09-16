import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./user/login/login.component";
import {ErrorComponent} from "./shared/error/error.component";

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: LoginComponent},
    {
        path: 'event',
        loadChildren: () => import('./surf-event/surf-event.module').then(m => m.SurfEventModule)
    },
    {
        path: 'riders',
        loadChildren: () => import('./riders/riders.module').then(m => m.RidersModule)
    },
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
