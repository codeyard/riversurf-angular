import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {RiderProfileComponent} from "./rider-profile/rider-profile.component";
import {RidersComponent} from "./riders.component";

const routes: Routes = [
    {path: '', component: RidersComponent},
    {path: ':id', component: RiderProfileComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RidersRoutingModule {
}
