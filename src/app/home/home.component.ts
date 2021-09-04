import {Component} from '@angular/core';
import {Event, exampleEvent} from "../core/models/event.model";
import {Rider, exampleRiderMale, exampleRiderFemale, exampleRiderKid} from "../core/models/rider.model";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
    selector: 'rs-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    events: Event[] = [exampleEvent, exampleEvent, exampleEvent, exampleEvent, exampleEvent, exampleEvent];
    riders: Rider[] = [exampleRiderMale, exampleRiderFemale, exampleRiderKid, exampleRiderMale, exampleRiderFemale];

    currentEvent = 0;

    smallScreen?: boolean;

    constructor(private observer: BreakpointObserver) {
        this.observer.observe('(max-width: 878px)').subscribe(result => {
            this.smallScreen = result.matches;
        });
    }
}
