import {RouterModule, Routes} from "@angular/router";
import {SurfEventComponent} from "./surf-event/surf-event.component";
import {CompetitionComponent} from "./surf-event/competition/competition.component";
import {NgModule} from "@angular/core";
import {ResultViewComponent} from "./result-view/result-view.component";


const routes: Routes = [
    {path: ':id', component: SurfEventComponent},
    {path: ':id/competition/:division', component: CompetitionComponent},
    {path: ':id/competition/:division/view', component: ResultViewComponent},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SurfEventRoutingModule {
}
