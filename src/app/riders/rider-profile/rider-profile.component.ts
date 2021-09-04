import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Rider, exampleRiderMale} from "../../core/models/rider.model";

@Component({
    selector: 'rs-rider-profile',
    templateUrl: './rider-profile.component.html',
    styleUrls: ['./rider-profile.component.scss']
})
export class RiderProfileComponent implements OnInit {

    riderId: String = 'unknown';

    rider ?: Rider;

    constructor(private route: ActivatedRoute) {
        this.route.params.subscribe(params => {
            this.riderId = params['id'];

            // ToDo: Get rider details from db-service
            this.rider = {...exampleRiderMale};
        });
    }

    ngOnInit(): void {
    }
}
