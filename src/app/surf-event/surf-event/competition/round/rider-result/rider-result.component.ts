import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {RidersService} from "../../../../../core/services/riders.service";
import {Rider} from "../../../../../core/models/rider.model";
import {Subscription} from "rxjs";

export type RiderResultType = 'default' | 'assigned' | 'surfing' | 'finished';

@Component({
    selector: 'rs-rider-result',
    templateUrl: './rider-result.component.html',
    styleUrls: ['./rider-result.component.scss']
})
export class RiderResultComponent implements OnInit, OnDestroy {

    @Input() riderId!: string;
    @Input() riderColorIndex!: number;
    @Input() disableInput!: boolean;
    @Output() resultEntry = new EventEmitter<{riderId: string, points: number, colorIndex: number}>();

    @Input() resultType: RiderResultType = 'default';

    rider ?: Rider;

    private riderSubscription ?: Subscription;

    constructor(private riderService: RidersService) {
    }

    ngOnInit(): void {
        this.riderSubscription = this.riderService.getRider(this.riderId).subscribe(rider => this.rider = rider);
    }

    ngOnDestroy(): void {
        this.riderSubscription?.unsubscribe();
    }

    onResultEntry(points: string) {
        this.resultEntry.emit({riderId : this.riderId, points: +points, colorIndex: this.riderColorIndex});
    }

}
