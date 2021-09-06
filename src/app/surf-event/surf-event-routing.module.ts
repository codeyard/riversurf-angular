import {RouterModule, Routes} from "@angular/router";
import {SurfEventComponent} from "./surf-event/surf-event.component";
import {CompetitionComponent} from "./surf-event/competition/competition.component";
import {NgModule} from "@angular/core";


const routes: Routes = [
    {path: ':id', component: SurfEventComponent},
    {path: ':id/competition/:division', component: CompetitionComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SurfEventRoutingModule {
}
