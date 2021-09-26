import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {SnackbarService} from "../../../../core/services/snackbar.service";
import {Heat, Round} from "../../../../core/models/competition.model";
import {CompetitionService} from "../../../../core/services/competition.service";
import {ActivatedRoute, Router} from "@angular/router";
import {WebSocketService} from "../../../../core/services/web-socket.service";

@Component({
    selector: 'rs-round',
    templateUrl: './round.component.html',
    styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit, OnChanges {
    @Input() hasNextRound!: boolean;
    @Input() round!: Round;
    @Input() maxRidersInHeat!: number;
    @Input() isFinalRound!: boolean;
    @Output() finishedRound = new EventEmitter<{currentRound: number, promotedRiders: string[]}>();
    @Output() syncRound = new EventEmitter<Round>();
    areAllHeatsFinished!: boolean;
    unassignedRiders!: string[];

    constructor(
        private snackbarService: SnackbarService,
        private competitionService: CompetitionService,
        private router: Router,
        private route: ActivatedRoute,
        private webSocketService: WebSocketService) {
    }

    ngOnInit(): void {
        this.allHeatsFinished();
    }

    ngOnChanges(): void {
        this.setupRound();
    }

    setupRound(): void {
        const numberOfHeats = this.competitionService.calculateMinimumHeats(this.round.riders.length, this.maxRidersInHeat);
        for (let i = this.round.heats.length; i < numberOfHeats; i++) {
            this.round.heats.push({
                id: i,
                riders: [],
                state: 'idle',
                results: []
            })
        }

        this.unassignedRiders = [...this.round.riders];
        for(let heat of this.round.heats) {
            this.unassignedRiders = this.unassignedRiders.filter(riderId => !heat.riders.includes(riderId));
        }
    }

    drop(event: CdkDragDrop<string[], any>) {
        console.log(`event`, event);
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            return
        } else {
            if (event.container.data.length !== this.maxRidersInHeat || event.container.id === 'unassignedRiders') {
                transferArrayItem(event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex);
                this.snackbarService.send(`Successfully Assigned!`, "success")
                return
            }
        }
        this.snackbarService.send(`Sorry, this heat is already complete!`, "warning")
        console.log(`heats`, this.round.heats);
    }

    revert() {
        for (const heat of this.round.heats) {
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
        const randomGroupNumber = Math.floor(Math.random() * this.round.heats.length);
        this.round.heats[randomGroupNumber].riders.length < this.maxRidersInHeat
            ? this.round.heats[randomGroupNumber].riders.push(riderId)
            : this.assignRiderToHeat(riderId);
    }

    hasNoHeatStarted():boolean {
        return this.round.heats.every(heat => heat.state === 'idle');
    }

    allHeatsFinished(): void {
        this.areAllHeatsFinished = this.round.heats.every(heat => heat.state === 'completed');
    }

    moveToNextRound(roundNumber: number) {
        let promotedRiders = [];
        for (const heat of this.round.heats) {
            const sortedArray = heat.results.sort((a, b) => a.value < b.value ? 1 : -1)
            if (roundNumber === 0) {
                promotedRiders.push(sortedArray.map(result => result.riderId));
            } else {
                promotedRiders.push(sortedArray.map(result => result.riderId).splice(0, 2));
            }
        }
        promotedRiders = promotedRiders.reduce((acc, val) => acc.concat(val), []);
        this.finishedRound.emit({currentRound: roundNumber, promotedRiders: promotedRiders});
    }

    handleStatusChange(event: { action: string, heat: Heat }) {
        let msg = `Heat ${event.heat.id + 1} `
        switch (event.action) {
            case "start":
                this.round.heats[event.heat.id] = {...event.heat, state: 'running'}
                msg += "started!"
                break;
            case "stop":
                this.round.heats[event.heat.id] = {...event.heat, state: 'finished'}
                this.snackbarService.send(`Heat ${event.heat.id + 1} started!`, 'success')
                msg += "stopped!"
                break;
            case "save":
                this.round.heats[event.heat.id] = {...event.heat, state: 'completed'}
                this.allHeatsFinished()
                msg += "saved!"
                break;
        }
        this.snackbarService.send(msg, "success");
        this.webSocketService.sendNotification({
            surfEventName: "",
            topic: "heat",
            action: event.action,
            riders: event.heat.riders,
            timestamp: Date.now().toString(),
            link: this.router.url.slice(0, -5) // remove "/edit"
        })
        this.onSyncRound()
    }

    finishCompetition() {
        this.snackbarService.send("Competition finished", "success");
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    onSyncRound() {
        this.syncRound.emit(this.round);
    }
}
