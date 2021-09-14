import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {HeatModel} from "../round.component";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {SnackbarService} from "../../../../../core/services/snackbar.service";
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'rs-heat',
    templateUrl: './heat.component.html',
    styleUrls: ['./heat.component.scss']
})
export class HeatComponent implements OnInit, OnChanges {
    @Input() hasUnassignedRiders!: boolean;
    @Input() hasStarted!: boolean;
    @Input() hasStopped!: boolean;
    @Input() hasAllResults!: boolean;
    @Input() heatNumber!: number;
    @Input() status!: string;
    @Input() isSaved!: boolean;
    @Input() riders!: string[];
    @Output() statusChange = new EventEmitter<{ action: string, heatNumber: number }>();
    @Output() drop = new EventEmitter<CdkDragDrop<string[], any>>();
    maxHeatSize = 4;

    heatForm!: FormGroup;



    constructor(private snackbarService: SnackbarService) {
    }

    ngOnInit(): void {
    }



    onStatusChange(action: string) {
        this.statusChange.emit({action, heatNumber: this.heatNumber});
    }

    getHeatStatus() {
        if (this.hasStopped) {
            return "finished"
        } else if (this.hasStarted) {
            return "surfing";
        } else {
            return "assigned"
        }
    }

    onDrop(event: CdkDragDrop<string[], any>) {
        this.drop.emit(event);
    }

    getControl(index: number): FormControl {
        return <FormControl>(this.heatForm.get('heats') as FormArray).controls[index];
    }

    getFormControl(index: number) {
        //return (<FormArray>this.heatForm.get('heats')).controls[index];
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.heatForm?.get('heats')?.reset();
        this.heatForm = new FormGroup({
            'heats': new FormArray([])
        });

        for(let i = 0; i <this.riders.length; i++) {
            (<FormArray>this.heatForm.get('heats')).push(new FormControl(null, Validators.required))
        }
    }

}
