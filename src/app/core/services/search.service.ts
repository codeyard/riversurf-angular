import {Injectable} from '@angular/core';
import {RidersService} from "./riders.service";
import {SurfEventService} from "./surf-event.service";
import {merge} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    constructor(private ridersService: RidersService, private surfEventService: SurfEventService) {
    }

    searchByTerm(term: string) {
        merge(this.surfEventService.getSurfEvents(), this.ridersService.getRiders())
            .subscribe(val => console.log(val))
    }

}
