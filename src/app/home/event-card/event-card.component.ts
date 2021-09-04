import {Component, Input} from '@angular/core';
import {Event} from "../../core/models/event.model";
import {Division} from "../../core/models/division.type";

@Component({
    selector: 'rs-event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent {
    @Input()
    surfEvent!: Event;

    getColorOfDivision(division: Division) {
        switch (division) {
            case "male":
                return 'primary'
            case "female":
                return 'accent'
            case "kid":
                return 'warn'
        }
    }


}
