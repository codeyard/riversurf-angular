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
    @Input() heat!: HeatModel;
    @Input() heatNumber!: number;
    @Input() status!: string;
    @Input() isSaved!: boolean;
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
        return <FormControl>(this.heatForm.get('heats') as FormArray).controls[index];
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.heatForm?.get('heats')?.reset();
        this.heatForm = new FormGroup({
            'heats': new FormArray([])
        });

        for(let i = 0; i < this.heat.riders.length; i++) {
            (<FormArray>this.heatForm.get('heats')).push(new FormControl(null, [Validators.required, Validators.pattern("^([0-9]{1,2}){1}(\\.[0-9]{1})?$")]));
        };
    }

}
