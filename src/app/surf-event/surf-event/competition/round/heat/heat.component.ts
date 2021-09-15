import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {HeatModel} from "../round.component";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {SnackbarService} from "../../../../../core/services/snackbar.service";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Result} from "../../../../../core/models/competition.model";


@Component({
    selector: 'rs-heat',
    templateUrl: './heat.component.html',
    styleUrls: ['./heat.component.scss'],
})
export class HeatComponent implements OnInit, OnChanges {
    @Input() hasUnassignedRiders!: boolean;
    @Input() heat!: HeatModel;
    @Input() heatNumber!: number;
    @Output() statusChange = new EventEmitter<{ action: string, heatNumber: number, heat: HeatModel, form: FormGroup }>();
    @Output() drop = new EventEmitter<CdkDragDrop<string[], any>>();
    maxHeatSize = 4;
    status!: string;
    heatForm!: FormGroup;


    constructor() {
    }

    ngOnInit(): void {
    }

    onStatusChange(action: string) {
        if (action === 'save') {
            this.setResults()
        }
        this.statusChange.emit({action, heatNumber: this.heatNumber, heat: this.heat, form: this.heatForm});
    }

    setResults() {
        for (let i = 0; i < this.heat.riders.length; i++) {
            const result: Result = {
                riderId: this.heat.riders[i],
                color: i,
                value: this.heatForm.controls['heat'].value[i]
            }
            this.heat.results.push(result)
        }

    }

    getHeatStatus() {
        if (this.heat.hasStopped) {
            return "finished"
        } else if (this.heat.hasStarted) {
            return "surfing";
        } else {
            return "assigned"
        }
    }

    onDrop(event: CdkDragDrop<string[], any>) {
        this.drop.emit(event);
    }

    getControl(index: number): FormControl {
        return <FormControl>(this.heatForm.get('heat') as FormArray).controls[index];
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.status = this.heat.results.length > 0 ? 'finished' : 'assigned'

        this.heatForm?.get('heat')?.reset();

        this.heatForm = new FormGroup({
            'heat': new FormArray([])
        });

        for (let i = 0; i < this.heat.riders.length; i++) {
            const initValue = this.heat.results[i]?.value || null;
            (<FormArray>this.heatForm.get('heat')).push(new FormControl({
                value: initValue,
                disabled: this.heat.results.length > 0
            }, [Validators.required, Validators.pattern("^([0-9]{1,2}){1}(\\.[0-9]{1})?$")]));
        }
    }


}
