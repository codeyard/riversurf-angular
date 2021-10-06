import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {SearchService} from "../services/search.service";
import {SurfEvent} from "../models/surf-event.model";
import {Rider} from "../models/rider.model";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {SlugifyPipe} from "../../shared/pipes/slugify.pipe";
import {ActivatedRoute, Router} from "@angular/router";

export interface SearchResults {
    events: SurfEvent[],
    riders: Rider[]
}

@Component({
    selector: 'rs-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    autocompleteCtrl = new FormControl();
    filteredResults: SearchResults = {events: [], riders: []};

    isMac: boolean = navigator.platform.toLowerCase().indexOf('mac') >= 0;

    constructor(
        private searchService: SearchService,
        private router: Router,
        private route: ActivatedRoute,
        private slugify: SlugifyPipe) {
        this.autocompleteCtrl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap(term => this.searchByTerm(term))
        ).subscribe();
    }

    searchByTerm(term: string) {
        this.searchService.searchByTerm(term)
            .subscribe(([events, riders]) => {
                this.filteredResults.events = events as SurfEvent[];
                this.filteredResults.riders = riders as Rider[];
            });
    }

    goToSurfEvent(surfEvent: SurfEvent) {
        this.autocompleteCtrl.patchValue('');
        const slugifiedName = this.slugify.transform(surfEvent.name);
        this.router.navigate([`/event/${slugifiedName}-${surfEvent.id}`], {relativeTo: this.route}).then();
    }

    goToRider(rider: Rider) {
        this.autocompleteCtrl.patchValue('');
        const slugifiedName = this.slugify.transform(rider.nickName + '-' + rider.id);
        this.router.navigate([`/riders/${slugifiedName}`], {relativeTo: this.route}).then();
    }
}
