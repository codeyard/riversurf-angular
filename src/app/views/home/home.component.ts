import {Component} from '@angular/core';
import {Event, exampleEvent} from "../../models/event.model";
import {Rider, exampleRiderMale, exampleRiderFemale, exampleRiderKid} from "../../models/rider.model";

@Component({
    selector: 'surf-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    events: Event[] = [exampleEvent, exampleEvent, exampleEvent];
    riders: Rider[] = [exampleRiderMale, exampleRiderFemale, exampleRiderKid, exampleRiderMale, exampleRiderFemale];
}
