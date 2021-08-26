import {Component, Input, OnInit} from '@angular/core';
import {Rider, riderExample} from "../../../../models/rider.model";

@Component({
  selector: 'surf-rider-overview',
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
