import {RouterModule, Routes} from "@angular/router";
import {SurfEventComponent} from "./surf-event/surf-event.component";
import {CompetitionComponent} from "./surf-event/competition/competition.component";
import {NgModule} from "@angular/core";
import {ResultViewComponent} from "./result-view/result-view.component";
import {AuthGuard} from "../core/services/auth/auth.guard";


const routes: Routes = [
    {path: ':id', children: [
            {path: '', component: SurfEventComponent},
            {path: 'competition/:division', component: ResultViewComponent},
            {path: 'competition/:division/edit', canActivate:[AuthGuard], component: CompetitionComponent},
            {path: '**', redirectTo: ''}
            ]}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SurfEventRoutingModule {
}
