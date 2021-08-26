import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'surf-rider-profile',
    templateUrl: './rider-profile.component.html',
    styleUrls: ['./rider-profile.component.scss']
})
export class RiderProfileComponent implements OnInit {

    riderId : String = 'unknown';

    constructor(private route: ActivatedRoute) {
        this.route.params.subscribe(params => {
            console.log(`Parameters`, params);
            this.riderId = params['id'];
        });
    }

    ngOnInit(): void {
    }
}
