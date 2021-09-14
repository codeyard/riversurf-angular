import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
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
    @Input() disableInput!: boolean;
    @Input() formControl!: FormControl;
    @Output() resultEntry = new EventEmitter<{riderId: string, points: number, colorIndex: number}>();
    @Input() resultType: RiderResultType = 'default';

    points!: FormGroup;

    rider ?: Rider;

    private riderSubscription ?: Subscription;

    constructor(private riderService: RidersService) {
    }

    ngOnInit(): void {
        this.riderSubscription = this.riderService.getRider(this.riderId).subscribe(rider => this.rider = rider);
        this.points = new FormGroup({
            'pointsInput': new FormControl({value: '', disabled: this.disableInput}, [Validators.required, Validators.pattern("^([0-9]{1,2}){1}(\\.[0-9]{1})?$")])
        });

        this.points.valueChanges.subscribe(
            (val) => {
                this.resultEntry.emit({riderId : this.riderId, points: +val.pointsInput, colorIndex: this.riderColorIndex});
            }
        )
    }

    ngOnDestroy(): void {
        this.riderSubscription?.unsubscribe();
    }

}
