import {Component, Input, OnInit} from '@angular/core';
import {Heat} from "../../../../core/models/competition.model";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {SnackbarService} from "../../../../core/services/snackbar.service";

export interface HeatModel{
    id: number;
    riders: string[];
}

@Component({
    selector: 'rs-round',
    templateUrl: './round.component.html',
    styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit {

    @Input() riders !: string[];
    @Input() roundNumber !: number;

    heatSize = 4;

    heats : HeatModel[] = [];

    constructor(private snackbarService: SnackbarService) {
    }

    ngOnInit(): void {
        const numberOfHeats = Math.ceil(this.riders.length / this.heatSize);
        for (let i = 0; i < numberOfHeats; i++) {
            this.heats.push({
                id: i,
                riders : []
            })
        }
        // ToDo: Automate assignment of riders to heats
    }

    drop(event: CdkDragDrop<string[], any>) {
        console.log(`event`, event);
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            return
        } else {
            if(event.container.data.length !== this.heatSize || event.container.id === 'unassignedRiders') {
                transferArrayItem(event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex);
                this.snackbarService.send(`Successfully Assigned!`, "success")
                return
            }
        }
        this.snackbarService.send(`Heat already full!`, "warning")

        console.log(`heats`, this.heats);
    }
}
