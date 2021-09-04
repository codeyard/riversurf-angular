import {Component, Input, OnInit} from '@angular/core';
import {Rider} from "../../../core/models/rider.model";

@Component({
    selector: 'rs-rider-overview',
    templateUrl: './rider-overview.component.html',
    styleUrls: ['./rider-overview.component.scss']
})
export class RiderOverviewComponent implements OnInit {

    @Input() rider !: Rider;

    constructor() {
    }

    ngOnInit(): void {
    }

}
