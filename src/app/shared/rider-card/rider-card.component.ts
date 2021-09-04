import {Component, Input} from '@angular/core';
import {Rider} from "../../core/models/rider.model";

@Component({
    selector: 'rs-rider-card',
    templateUrl: './rider-card.component.html',
    styleUrls: ['./rider-card.component.scss']
})
export class RiderCardComponent {
    @Input()
    rider!: Rider;
}
