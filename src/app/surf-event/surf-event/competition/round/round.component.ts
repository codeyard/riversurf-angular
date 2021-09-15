import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {SnackbarService} from "../../../../core/services/snackbar.service";
import {Result} from "../../../../core/models/competition.model";

export interface HeatModel {
    id: number;
    riders: string[];
    hasStarted: boolean;
    hasStopped: boolean;
    hasAllResults: boolean
    results: Result[]
}

@Component({
    selector: 'rs-round',
    templateUrl: './round.component.html',
    styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit, OnChanges {

    @Input() riders !: string[];
    @Input() roundNumber !: number;

    @Output() finishedRound = new EventEmitter<string[]>();

    unassignedRiders!: string[];
    heatSize = 4;
    heats: HeatModel[] = [];
    oneHeatStarted = false;
    heatsFinished: boolean[] = [];

    constructor(private snackbarService: SnackbarService) {
    }

    ngOnInit(): void {
        //this.setupRound();
    }

    ngOnChanges(): void {
        this.setupRound();
    }

    setupRound(): void {
        this.unassignedRiders = [...this.riders];
        const numberOfHeats = Math.ceil(this.unassignedRiders.length / this.heatSize);
        for (let i = 0; i < numberOfHeats; i++) {
            this.heats.push({
                id: i,
                riders: [],
                hasStarted: false,
                hasStopped: false,
                hasAllResults: false,
                results: []
            })
            this.heatsFinished.push(false);
        }
    }

    drop(event: CdkDragDrop<string[], any>) {
        console.log(`event`, event);
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            return
        } else {
            if (event.container.data.length !== this.heatSize || event.container.id === 'unassignedRiders') {
                transferArrayItem(event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex);
                this.snackbarService.send(`Successfully Assigned!`, "success")
                return
            }
        }
        this.snackbarService.send(`Sorry, this heat is already complete!`, "warning")
        console.log(`heats`, this.heats);
    }

    revert() {
        for (const heat of this.heats) {
            const heatLength = heat.riders.length;
            for (let i = 0; i <= heatLength; i++) {
                const removedRider = heat.riders.pop()
                if (removedRider)
                    this.unassignedRiders.push(removedRider);
            }
            this.snackbarService.send("All riders are no longer assigned", "success");
        }
    }

    automaticallyAssignRiders() {
        for (let i = this.unassignedRiders.length - 1; i >= 0; i--) {
            const riderId = this.unassignedRiders.splice(Math.floor(Math.random() * this.unassignedRiders.length), 1);
            this.assignRiderToHeat(riderId[0]);
        }
        this.snackbarService.send("Hope you like my heat assignment?", "success")
    }

    assignRiderToHeat(riderId: string) {
        const randomGroupNumber = Math.floor(Math.random() * this.heats.length);
        this.heats[randomGroupNumber].riders.length < this.heatSize
            ? this.heats[randomGroupNumber].riders.push(riderId)
            : this.assignRiderToHeat(riderId);
    }

    checkAllHeatsFinished(): boolean {
        return !this.heats.map(heat => heat.riders.length === heat.results.length).some(element => element)
    }

    heatHasAllResults(heatNumber: number): boolean {
        const hasAllresults = this.heats[heatNumber].results.length === this.heats[heatNumber].riders.length
        this.heats[heatNumber].hasAllResults = hasAllresults;
        return hasAllresults;
    }

    moveToNextRound(roundNumber: number) {
        let promotedRiders = [];
        for (const heat of this.heats) {
            const sortedArray = heat.results.sort((a, b) => a.value > b.value ? 1 : -1)
            if (roundNumber === 0) {
                promotedRiders.push(sortedArray.map(result => result.riderId));
            } else {
                promotedRiders.push(sortedArray.map(result => result.riderId).splice(0, 2));
            }
        }
        promotedRiders = promotedRiders.reduce((acc, val) => acc.concat(val), []);
        console.log('promotedRiders:', promotedRiders)
        this.finishedRound.emit(promotedRiders);
    }

    getHeatStatus(heat: HeatModel) {
        if (heat.hasStopped) {
            return "finished"
        } else if (heat.hasStarted) {
            return "surfing";
        } else {
            return "assigned"
        }
    }

    handleStatusChange(event: { action: string, heatNumber: number, heat: HeatModel }) {
        switch (event.action) {
            case "start":
                this.heats[event.heatNumber] = {...event.heat, hasStarted: true}
                this.oneHeatStarted = true;
                break;
            case "stop":
                this.heats[event.heatNumber] = {...event.heat, hasStopped: true}
                break;
            case "save":
                //TODO ADD RESULTS AND CHECK IF ALL RESULTS ARE AVIALBE
                this.heats[event.heatNumber] = {...event.heat, hasAllResults: true}
                //this.heatHasAllResults(event.heatNumber);
                this.snackbarService.send("Results saved!", "success");
                break;
        }
    }


}
