import {Component, Input, OnInit} from '@angular/core';
import {SurfEvent} from "../../core/models/surf-event.model";
import {SurfEventService} from "../../core/services/surf-event.service";

@Component({
    selector: 'rs-event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
    @Input()
    surfEvent!: SurfEvent;
    isUpcomingSurfEvent!: boolean;

    constructor(private surfEventService: SurfEventService) {
    }

    ngOnInit(): void {
        this.isUpcomingSurfEvent = this.surfEventService.isUpcomingSurfEvent(this.surfEvent.startDateTime);
    }

    onClick(event: Event) {
        event.stopImmediatePropagation();
    }
}
