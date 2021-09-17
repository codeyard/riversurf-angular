import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {RidersService} from "../../../../../core/services/riders.service";
import {Rider} from "../../../../../core/models/rider.model";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";

export type RiderResultType = 'default' | 'assigned' | 'surfing' | 'finished';

@Component({
    selector: 'rs-rider-result',
    templateUrl: './rider-result.component.html',
    styleUrls: ['./rider-result.component.scss']
})
export class RiderResultComponent implements OnInit, OnDestroy {

    @Input() riderId!: string;
    @Input() riderColorIndex!: number;
    @Input() disableInput?: boolean;
    @Input() control?: FormControl;
    @Input() resultType!: RiderResultType;
    @Input() points?: number;

    rider ?: Rider;

    private riderSubscription ?: Subscription;

    constructor(private riderService: RidersService, private elementRef: ElementRef) {
    }

    ngOnInit(): void {
        this.riderSubscription = this.riderService.getRider(this.riderId).subscribe(rider => this.rider = rider);
    }

    ngOnDestroy(): void {
        this.riderSubscription?.unsubscribe();
    }

}
