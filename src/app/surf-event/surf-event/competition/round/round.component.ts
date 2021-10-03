import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MessageLevel, SnackbarService} from "../../../../core/services/snackbar.service";
import {Heat, Round} from "../../../../core/models/competition.model";
import {CompetitionService} from "../../../../core/services/competition.service";
import {ActivatedRoute, Router} from "@angular/router";
import {WebSocketService} from "../../../../core/services/web-socket.service";
import {NetworkStatusService} from "../../../../core/services/network-status.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'rs-round',
    templateUrl: './round.component.html',
    styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit, OnChanges, OnDestroy {
    @Input() hasNextRound!: boolean;
    @Input() round!: Round;
    @Input() maxRidersInHeat!: number;
    @Input() isFinalRound!: boolean;
    @Output() finishedRound = new EventEmitter<{currentRound: number, promotedRiders: string[]}>();
    @Output() syncRound = new EventEmitter<Round>();
    areAllHeatsFinished!: boolean;
    unassignedRiders!: string[];

    networkStatusSubscription?: Subscription;
    isOffline: boolean = false;

    constructor(
        private snackbarService: SnackbarService,
        private competitionService: CompetitionService,
        private router: Router,
        private route: ActivatedRoute,
        private webSocketService: WebSocketService,
        private networkStatusService: NetworkStatusService) {
    }

    ngOnInit(): void {
        this.allHeatsFinished();

        this.networkStatusSubscription = this.networkStatusService.getNetworkStatus().subscribe(status => {
            this.isOffline = status !== 'ONLINE';
        });
    }

    ngOnChanges(): void {
        this.setupRound();
    }

    ngOnDestroy() {
        this.networkStatusSubscription?.unsubscribe();
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
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            return
        } else {
            if (event.container.data.length !== this.maxRidersInHeat || event.container.id === 'unassignedRiders') {
                transferArrayItem(event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex);
                this.snackbarService.send(`Successfully Assigned to Heat!`, "success")
                return
            }
        }
        this.snackbarService.send(`Sorry mate, this heat is already full!`, "warning")
    }

    revert() {
        for (const heat of this.round.heats) {
            const heatLength = heat.riders.length;
            for (let i = 0; i <= heatLength; i++) {
                const removedRider = heat.riders.pop()
                if (removedRider)
                    this.unassignedRiders.push(removedRider);
            }
            this.snackbarService.send("All Riders are waiting to be assigned to a Heat!", "success");
        }
    }

    automaticallyAssignRiders() {
        for (let i = this.unassignedRiders.length - 1; i >= 0; i--) {
            const riderId = this.unassignedRiders.splice(Math.floor(Math.random() * this.unassignedRiders.length), 1);
            this.assignRiderToHeat(riderId[0]);
        }
        this.snackbarService.send("Mate, hope you like my heat assignment?", "success")
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
            if (roundNumber === 0) {
                promotedRiders.push(heat.results.map(result => result.riderId));
            } else {
                promotedRiders.push(heat.results.map(result => result.riderId).splice(0, 2));
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
                this.snackbarService.send(`Heat ${event.heat.id + 1} stopped!`, 'success')
                msg += "stopped!"
                break;
            case "save":
                event.heat.results = event.heat.results.sort((a, b) => a.value < b.value ? 1 : -1)
                this.round.heats[event.heat.id] = {...event.heat, state: 'completed'}
                this.allHeatsFinished()
                msg += "saved!"
                break;
        }
        if (this.isOffline) {
            msg += " But only on your device! :( Please go back online to save the updates on the server."
        }
        let messageLevel = this.isOffline ? 'warning' : 'success' as MessageLevel;
        this.snackbarService.send(msg, messageLevel);
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
        this.snackbarService.send("Competition finished! Legendary!", "success");
        this.router.navigate(['../'], { relativeTo: this.route }).then();
    }

    onSyncRound() {
        this.syncRound.emit(this.round);
    }
}
