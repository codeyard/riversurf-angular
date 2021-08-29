import {Component} from '@angular/core';
import {Event, exampleEvent} from "../../models/event.model";
import {Rider, exampleRiderMale, exampleRiderFemale, exampleRiderKid} from "../../models/rider.model";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
    selector: 'surf-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    events: Event[] = [exampleEvent, exampleEvent, exampleEvent, exampleEvent, exampleEvent, exampleEvent];
    riders: Rider[] = [exampleRiderMale, exampleRiderFemale, exampleRiderKid, exampleRiderMale, exampleRiderFemale];


    smallScreen?: boolean;

    constructor(private observer: BreakpointObserver) {
        this.observer.observe('(max-width: 878px)').subscribe(result => {
            this.smallScreen = result.matches;
        });
    }
}
