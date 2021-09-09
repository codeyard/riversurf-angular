import {Component, Input, OnInit} from '@angular/core';
import {Heat} from "../../../../core/models/competition.model";

@Component({
    selector: 'rs-round',
    templateUrl: './round.component.html',
    styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit {

    @Input() riders !: string[];
    @Input() roundNumber !: number;

    heatSize = 4;

    heat : Heat[] = [];
    
    constructor() {
    }

    ngOnInit(): void {
        const numberOfHeats = Math.ceil(this.riders.length / this.heatSize);
        for (let i = 0; i < numberOfHeats; i++) {
            this.heat.push({
                id: i
            })
        }
    }

}
