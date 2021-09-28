import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {RidersService} from "../../../../../core/services/riders.service";
import {Rider} from "../../../../../core/models/rider.model";
import {Subscription} from "rxjs";
import {FormControl} from "@angular/forms";

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
    @Input() roundNumber?: number;
    @Input() isHighlighted?: boolean
    @Input() isFadedOut?: boolean
    @Input() isEditMode?: boolean = false;
    @Input() isFinalRound?: boolean = false;
    @Input() isWinner?: boolean = false;


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
