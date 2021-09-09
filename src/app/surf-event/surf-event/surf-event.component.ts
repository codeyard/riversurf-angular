import {Component, OnInit} from '@angular/core';
import {SurfEvent, exampleEvent} from "../../core/models/surf-event.model";

@Component({
    selector: 'rs-surf-event',
    templateUrl: './surf-event.component.html',
    styleUrls: ['./surf-event.component.scss']
})
export class SurfEventComponent implements OnInit {

    surfEvent: SurfEvent = {...exampleEvent};

    constructor() {
    }

    ngOnInit(): void {
    }

}
