import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Heat, Result} from "../../../../../core/models/competition.model";
import {SnackbarService} from "../../../../../core/services/snackbar.service";

@Component({
    selector: 'rs-heat',
    templateUrl: './heat.component.html',
    styleUrls: ['./heat.component.scss'],
})
export class HeatComponent implements OnInit, OnChanges {
    @Input() hasUnassignedRiders!: boolean;
    @Input() heat!: Heat;
    @Input() maxRidersInHeat!: number;
    @Output() statusChange = new EventEmitter<{ action: string, heat: Heat, form: FormGroup }>();
    @Output() drop = new EventEmitter<CdkDragDrop<string[], any>>();

    heatForm!: FormGroup;

    constructor(private snackbarService: SnackbarService) {
    }

    ngOnInit(): void {
    }

    onStatusChange(action: string) {
        if (action === 'save') {
            this.setResults()
        }
        this.statusChange.emit({action, heat: this.heat, form: this.heatForm});

    }

    setResults() {
        for (let i = 0; i < this.heat.riders.length; i++) {
            const result: Result = {
                riderId: this.heat.riders[i],
                color: i,
                value: this.heatForm.controls['heat'].value[i]
            }
            this.heat.results[i] = result;
        }
    }

    getHeatStatus() {
        switch (this.heat.state) {
            case 'finished':
            case 'completed':
                return 'finished';

            case 'running':
                return 'surfing';

            default:
                return 'assigned';
        }
    }

    onDrop(event: CdkDragDrop<string[], any>) {
        if (this.heat.state === "idle") {
            this.drop.emit(event);
        } else {
            this.snackbarService.send("Fella, this heat is already in progress!", "warning");
        }
    }

    getControl(index: number): FormControl {
        return <FormControl>(this.heatForm.get('heat') as FormArray).controls[index];
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.heatForm?.get('heat')?.reset();

        this.heatForm = new FormGroup({
            'heat': new FormArray([])
        });

        for (let i = 0; i < this.heat.riders.length; i++) {
            const resultOfRiderIndex = this.heat.results.findIndex(result => result.riderId === this.heat.riders[i]);
            const initValue = resultOfRiderIndex > -1 ? this.heat.results[resultOfRiderIndex].value : null;
            (<FormArray>this.heatForm.get('heat')).push(new FormControl({
                value: initValue,
                disabled: this.heat.state === 'completed'
            }, [Validators.required, Validators.pattern("^([0-9]{1,2}){1}(\\.[0-9]{1})?$")]));
        }
    }


}
