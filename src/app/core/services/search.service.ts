import {Injectable} from '@angular/core';
import {RidersService} from "./riders.service";
import {SurfEventService} from "./surf-event.service";
import {zip} from "rxjs";
import {filter, map, take} from "rxjs/operators";
import {SurfEvent} from "../models/surf-event.model";
import {Rider} from "../models/rider.model";

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    constructor(private ridersService: RidersService, private surfEventService: SurfEventService) {
    }

    searchByTerm(term: string) {
        return zip(this.surfEventService.getSurfEvents(), this.ridersService.getRiders())
            .pipe(
                filter(([events, riders]) => {
                    return events.length > 0 && riders.length > 0
                }),
                take(1),
                map(([events, riders]) => {
                        return [
                            events.filter(surfEvent => this.filterEvent(term, surfEvent)),
                            riders.filter(rider => this.filterRider(term, rider))
                        ];
                    }
                )
            )
    }

    filterEvent(term: string, surfEvent: SurfEvent) {
        let text =
            surfEvent.name.toLowerCase()
            + surfEvent.location.toLowerCase()
            + surfEvent.description.toLowerCase()

        text = text.split(' ').join('');
        text = text.split(',').join('');

        const searchParts: string[] = term.toLowerCase().split(' ');
        return searchParts.some(word => text.indexOf(word) > -1);
    }

    filterRider(term: string, rider: Rider) {
        let text =
            rider.firstName.toLowerCase()
            + rider.lastName.toLowerCase()
            + rider.nickName.toLowerCase()

        text = text.split(' ').join('');

        const searchParts: string[] = term.toLowerCase().split(' ');
        return searchParts.some(word => text.indexOf(word) > -1);
    }
}
