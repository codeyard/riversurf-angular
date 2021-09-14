import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HeatModel} from "../round.component";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {SnackbarService} from "../../../../../core/services/snackbar.service";

@Component({
    selector: 'rs-heat',
    templateUrl: './heat.component.html',
    styleUrls: ['./heat.component.scss']
})
export class HeatComponent implements OnInit {
    @Input() hasUnassignedRiders!: boolean;
    @Input() hasStarted!: boolean;
    @Input() hasStopped!: boolean;
    @Input() hasAllResults!: boolean;
    @Input() heatNumber!: number;
    @Input() status!: string;
    @Input() isSaved!: boolean;
    @Input() riders!: string[];
    @Output() statusChange = new EventEmitter<{ action: string, heatNumber: number }>();
    maxHeatSize = 4;



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

    drop(event: CdkDragDrop<string[], any>) {
        console.log(`event`, event);
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            return
        } else {
            if (event.container.data.length !== this.maxHeatSize || event.container.id === 'unassignedRiders') {
                transferArrayItem(event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex);
                this.snackbarService.send(`Successfully Assigned!`, "success")
                return
            }
        }
        this.snackbarService.send(`Sorry, this heat is already complete!`, "warning")

    }

}
