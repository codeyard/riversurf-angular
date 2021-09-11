import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {SnackbarService} from "../../../../core/services/snackbar.service";

export interface HeatModel {
    id: number;
    riders: string[];
    hasStarted: boolean;
    hasStopped: boolean;
    hasAllResults: boolean
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
                hasAllResults: false
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
        this.heats[heatNumber].hasStarted = false;
        this.heats[heatNumber].hasStopped = true;

        // TODO ENABLE RESULTS ENTRANCE

    }

    saveHeat(heatNumber: number) {
        this.heatsFinished[heatNumber] = true;

    }

    checkAllHeatsFinished(): boolean {
        this.heats.some(heat => heat.hasStarted);
        return !this.heatsFinished.includes(false);
    }

    checkAllHeatsResult(heatNumber: number): boolean {
        this.heats[heatNumber].hasAllResults = true;
        // where we store results now?
        // are they in the heat on the rider?
        // if so return something like: !this.heats[index].results.includes(false);
        return true;
    }

    moveToNextRound() {
        // TODO
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

    onResultentry(event: {riderId: string, points: number }) {
        console.log(event)
        // TODO FIND RIDER AND STORE HIS RESULT

    }
}
