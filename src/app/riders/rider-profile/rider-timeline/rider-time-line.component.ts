import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EventTimeLine, EventTimeLineCollection} from "./time-line/event-timeline.model";
import {RiderHistoryService} from "./rider-history.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'rs-rider-time-line',
    templateUrl: './rider-time-line.component.html',
    styleUrls: ['./rider-time-line.component.scss']
})
export class RiderTimeLineComponent implements OnDestroy, OnInit {

    currentTimeLines ?: EventTimeLine[];
    historyTimeLineCollection ?: EventTimeLineCollection[];
    loading: boolean = true;
    @Input() riderId!: string;
    private riderTimeLineSubscription!: Subscription;

    constructor(private riderHistoryService: RiderHistoryService) {
    }

    ngOnDestroy(): void {
        this.riderTimeLineSubscription?.unsubscribe();
    }

    ngOnInit(): void {
        this.riderTimeLineSubscription = this.riderHistoryService.getRiderTimeLines(this.riderId).subscribe((timelines) => {
                const currentTimeLines = timelines.filter(timeline => timeline.ongoing).sort((a, b) => this.timeLineSorter(a, b));
                this.currentTimeLines = currentTimeLines.length > 0 ? currentTimeLines : undefined;
                const historyTimeLines = timelines.filter(timeline => !timeline.ongoing).sort((a, b) => this.timeLineSorter(a, b));
                const historyTimeLineCollection: EventTimeLineCollection[] = [];
                for (const timeLine of historyTimeLines) {
                    const year = new Date(timeLine.surfEvent.startDateTime).getFullYear();
                    const index = historyTimeLineCollection.findIndex(htl => htl.year === year);
                    if (index != -1) {
                        historyTimeLineCollection[index].timeLines.push(timeLine);

                    } else {
                        historyTimeLineCollection.push({
                            year: year,
                            timeLines: [timeLine]
                        })
                    }
                }
                this.historyTimeLineCollection = historyTimeLineCollection.length > 0 ? historyTimeLineCollection : undefined;
                this.loading = false;

            },
            error => {
                this.currentTimeLines = undefined;
                this.historyTimeLineCollection = undefined;
                this.loading = false;
            })

    }


    private timeLineSorter(tlA: EventTimeLine, tlB: EventTimeLine): number {
        if (new Date(tlA.surfEvent.startDateTime).getFullYear() < new Date(tlB.surfEvent.startDateTime).getFullYear()) {
            return -1;
        } else {
            if (new Date(tlA.surfEvent.startDateTime).getFullYear() > new Date(tlB.surfEvent.startDateTime).getFullYear()) {
                return 1;
            } else {
                return 0;
            }
        }
    }

}
