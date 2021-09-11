import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
export class RoundComponent implements OnInit {

    @Input() riders !: string[];
    @Input() roundNumber !: number;

    @Output() finishedRound = new EventEmitter<string[]>();

    heatSize = 4;
    heats: HeatModel[] = [];
    oneHeatStarted = false;
    heatsFinished: boolean[] = [];

    constructor(private snackbarService: SnackbarService) {
    }

    ngOnInit(): void {
        const numberOfHeats = Math.ceil(this.riders.length / this.heatSize);
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
        // ToDo: Automate assignment of riders to heats
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
            const heatLenght = heat.riders.length;
            for (let i = 0; i <= heatLenght; i++) {
                const removedRider = heat.riders.pop()
                if (removedRider)

                    setTimeout(() =>
                        this.riders.push(removedRider), 200)

            }
        }
        this.snackbarService.send("All riders are no longer assigned", "success");
    }

    automaticallyAssignRiders() {
        for (var i = this.riders.length - 1; i >= 0; i--) {
            const riderId = this.riders.splice(Math.floor(Math.random() * this.riders.length), 1);
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

    startHeat(heatNumber: number) {
        this.heats[heatNumber].hasStarted = true;
        this.oneHeatStarted = true;
    }

    stopHeat(heatNumber: number) {
        this.heats[heatNumber].hasStopped = true;

        // TODO ENABLE RESULTS ENTRANCE

    }

    saveHeat(heatNumber: number) {
        this.heatsFinished[heatNumber] = true;
        this.snackbarService.send("Results saved!", "success");

    }

    checkAllHeatsFinished(): boolean {
        return !this.heatsFinished.includes(false);
    }

    heatHasAllResults(heatNumber: number): boolean {
        const hasAllresults = this.heats[heatNumber].results.length === this.heats[heatNumber].riders.length
        this.heats[heatNumber].hasAllResults = hasAllresults;
        return hasAllresults;
    }

    moveToNextRound(roundNumber: number) {
        let promotedRiders = [];
        for(const heat of this.heats) {
            const sortedArray = heat.results.sort((a, b) => a.value > b.value ? 1 : -1)
            if(roundNumber === 0) {
                promotedRiders.push(sortedArray.map(result => result.riderId));
            } else {
                promotedRiders.push(sortedArray.map(result => result.riderId).splice(0, 2));
            }
        }
        promotedRiders = promotedRiders.reduce((acc, val) => acc.concat(val), []);
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

    onResultEntry(event: { riderId: string, points: number, colorIndex: number }) {
        const resultObject = {
            riderId: event.riderId,
            color: event.colorIndex,
            value: event.points
        }

        for (let i = 0; i < this.heats.length; i++) {
            if (this.heats[i].riders.findIndex(rider => rider === event.riderId) > -1) {
                const existinResultIndex = this.heats[i].results.findIndex(result => result.riderId === event.riderId)
                if (existinResultIndex > -1) {
                    if (event.points) {
                        this.heats[i].results[existinResultIndex] = resultObject;
                    } else {
                        this.heats[i].results.splice(existinResultIndex, 1)
                    }
                } else {
                    if (event.points) {
                        this.heats[i].results.push(resultObject);
                    }
                }
            }
            this.heatHasAllResults(i);
        }
    }
}
