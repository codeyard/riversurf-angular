import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    QueryList,
    ViewChildren
} from '@angular/core';
import {Competition, Heat, Result} from "../../core/models/competition.model";
import {RiderResultComponent} from "../surf-event/competition/round/rider-result/rider-result.component";
import {not} from "rxjs/internal-compatibility";

export interface Line {
    source: Point,
    target: Point
}

interface Point {
    x: number,
    y: number
}

@Component({
    selector: 'rs-result-view',
    templateUrl: './result-view.component.html',
    styleUrls: ['./result-view.component.scss']
})
export class ResultViewComponent implements OnInit, AfterViewInit, AfterViewChecked {

    competition: Competition = {...exampleComp};
    @ViewChildren(RiderResultComponent) results!: QueryList<any>;
    loaded: any;
    lines: Line[] = [];
    points: Point[] = []

    RIDER_WIDTH = 250;
    RIDER_HEIGHT = 25;


    constructor(private cd: ChangeDetectorRef) {
    }

    ngOnInit(): void {
    }

    getHeatStatus(heat: Heat) {
        switch (heat.state) {
            case 'finished':
            case 'completed':
                return 'finished';
            case 'running':
                return 'surfing';
            default:
                return 'assigned';
        }
    }

    ngAfterViewInit(): void {
        this.getLine()
        this.cd.detectChanges();
        this.loaded = true;
    }

    ngAfterViewChecked() {

    }

    getLine() {
        let relevantResultsForPoints: Result[][] = [];
        for (let i = 0; i < this.competition.rounds.length; i+=2) {
            const temp = this.competition.rounds[i].heats.map(heat => heat.results.map(result => result));
            const resultsFirst = temp.reduce((acc, val) => acc.concat(val), []);
            let resultSucceeding: any[] = []
            for (let j = 1; j < this.competition.rounds.length; j++) {
                const temp2 = this.competition.rounds[1].heats.map(heat => heat.results.map(result => result));
                resultSucceeding = temp2.reduce((acc, val) => acc.concat(val), []);
            }
            const promotedRiders = resultsFirst.filter(result1 => resultSucceeding.some((result2 => result1.riderId === result2.riderId)));
            relevantResultsForPoints.push(promotedRiders);
        }

        const resultsWithLine = relevantResultsForPoints.reduce((acc, val) => acc.concat(val), []);
        console.log(resultsWithLine)

        for(const result of resultsWithLine) {
            let points: Point[] = [];
            this.results.forEach(resultElementRef => {
                if(resultElementRef.riderId === result.riderId) {
                    if(resultElementRef.roundNumber === 0) {
                        const rightPoint = {x: resultElementRef.elementRef.nativeElement.offsetLeft + this.RIDER_WIDTH,
                            y: resultElementRef.elementRef.nativeElement.offsetTop + this.RIDER_HEIGHT}
                        points.push(rightPoint)
                        this.points.push(rightPoint)
                    } else if(resultElementRef.roundNumber === (this.competition.rounds.length - 1)) {
                        const leftPoint = {x: resultElementRef.elementRef.nativeElement.offsetLeft,
                            y: resultElementRef.elementRef.nativeElement.offsetTop + this.RIDER_HEIGHT}
                        points.push(leftPoint)
                        this.points.push(leftPoint)
                    } else {
                        const leftPoint = {x: resultElementRef.elementRef.nativeElement.offsetLeft,
                            y: resultElementRef.elementRef.nativeElement.offsetTop + this.RIDER_HEIGHT};
                        const rightPoint = {x: resultElementRef.elementRef.nativeElement.offsetLeft + this.RIDER_WIDTH,
                            y: resultElementRef.elementRef.nativeElement.offsetTop + this.RIDER_HEIGHT}
                        points.push(leftPoint)
                        points.push(rightPoint)
                        this.points.push(leftPoint)
                        this.points.push(rightPoint)
                    }
                }
            })

            for(let i = 0; i < points.length; i+=2) {
                try {
                    this.lines.push({
                        source: {
                            x: points[i].x,
                            y: points[i].y,

                        },
                        target: {
                            x: points[i + 1].x,
                            y: points[i + 1].y
                        }
                    })
                } catch (notLineException) {
                    console.log(notLineException)
                }
            }

        }
    }



}


const exampleComp: Competition = {
    division: 'male',
    id: "comp1",
    config: {
        maxRiders: 20,
        maxRidersInHeat: 4,
        winnersInHeat: 2
    },
    riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004", "6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008", "6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b", "6132710cfc13ae15b300000c", "6132710cfc13ae15b300000d", "6132710cfc13ae15b300000e", "6132710cfc13ae15b300000f"],
    rounds: [
        {
            id: 0,
            riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004", "6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008", "6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b", "6132710cfc13ae15b300000c", "6132710cfc13ae15b300000d", "6132710cfc13ae15b300000e", "6132710cfc13ae15b300000f"],
            heats: [
                {
                    id: 0,
                    riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004"],
                    state: 'finished',
                    results: [{
                        riderId: "6132710cfc13ae15b3000001",
                        color: 0,
                        value: 23
                    }, {
                        riderId: "6132710cfc13ae15b3000002",
                        color: 1,
                        value: 12
                    }, {
                        riderId: "6132710cfc13ae15b3000003",
                        color: 2,
                        value: 32
                    }, {
                        riderId: "6132710cfc13ae15b3000004",
                        color: 3,
                        value: 31
                    }]
                }, {
                    id: 1,
                    riders: ["6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008"],
                    state: 'running',
                    results: [{
                        riderId: "6132710cfc13ae15b3000005",
                        color: 0,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000006",
                        color: 1,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000007",
                        color: 2,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000008",
                        color: 3,
                        value: 0
                    }]
                },  {
                    id: 2,
                    riders: ["6132710cfc13ae15b300000c", "6132710cfc13ae15b300000d", "6132710cfc13ae15b300000e", "6132710cfc13ae15b300000f"],
                    state: 'idle',
                    results: [{
                        riderId: "6132710cfc13ae15b300000c",
                        color: 0,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000d",
                        color: 1,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000e",
                        color: 2,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000f",
                        color: 3,
                        value: 0
                    }]
                }, {
                    id: 3,
                    riders: ["6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b"],
                    state: 'idle',
                    results: [{
                        riderId: "6132710cfc13ae15b3000009",
                        color: 0,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000a",
                        color: 1,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000b",
                        color: 2,
                        value: 0
                    }]
                }
            ]
        },
        {
            id: 1,
            riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004", "6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008", "6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b", "6132710cfc13ae15b300000c", "6132710cfc13ae15b300000d", "6132710cfc13ae15b300000e", "6132710cfc13ae15b300000f"],
            heats: [
                {
                    id: 0,
                    riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004"],
                    state: 'finished',
                    results: [{
                        riderId: "6132710cfc13ae15b3000001",
                        color: 0,
                        value: 23
                    }, {
                        riderId: "6132710cfc13ae15b3000002",
                        color: 1,
                        value: 12
                    }, {
                        riderId: "6132710cfc13ae15b3000003",
                        color: 2,
                        value: 32
                    }, {
                        riderId: "6132710cfc13ae15b3000004",
                        color: 3,
                        value: 31
                    }]
                }, {
                    id: 1,
                    riders: ["6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008"],
                    state: 'running',
                    results: [{
                        riderId: "6132710cfc13ae15b3000005",
                        color: 0,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000006",
                        color: 1,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000007",
                        color: 2,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000008",
                        color: 3,
                        value: 0
                    }]
                }, {
                    id: 2,
                    riders: ["6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b"],
                    state: 'idle',
                    results: [{
                        riderId: "6132710cfc13ae15b3000009",
                        color: 0,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000a",
                        color: 1,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000b",
                        color: 2,
                        value: 0
                    }]
                }, {
                    id: 3,
                    riders: ["6132710cfc13ae15b300000c", "6132710cfc13ae15b300000d", "6132710cfc13ae15b300000e", "6132710cfc13ae15b300000f"],
                    state: 'idle',
                    results: [{
                        riderId: "6132710cfc13ae15b300000c",
                        color: 0,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000d",
                        color: 1,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000e",
                        color: 2,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000f",
                        color: 3,
                        value: 0
                    }]
                }
            ]
        },
        {
            id: 2,
            riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004", "6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008", "6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b", "6132710cfc13ae15b300000c", "6132710cfc13ae15b300000d", "6132710cfc13ae15b300000e", "6132710cfc13ae15b300000f"],
            heats: [
                {
                    id: 0,
                    riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004"],
                    state: 'finished',
                    results: [{
                        riderId: "6132710cfc13ae15b3000001",
                        color: 0,
                        value: 23
                    }, {
                        riderId: "6132710cfc13ae15b3000002",
                        color: 1,
                        value: 12
                    }, {
                        riderId: "6132710cfc13ae15b3000003",
                        color: 2,
                        value: 32
                    }, {
                        riderId: "6132710cfc13ae15b3000004",
                        color: 3,
                        value: 31
                    }]
                }, {
                    id: 1,
                    riders: ["6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008"],
                    state: 'running',
                    results: [{
                        riderId: "6132710cfc13ae15b3000005",
                        color: 0,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000006",
                        color: 1,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000007",
                        color: 2,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000008",
                        color: 3,
                        value: 0
                    }]
                }, {
                    id: 2,
                    riders: ["6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b"],
                    state: 'idle',
                    results: [{
                        riderId: "6132710cfc13ae15b3000009",
                        color: 0,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000a",
                        color: 1,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000b",
                        color: 2,
                        value: 0
                    }]
                }
            ]
        },
        {
            id: 3,
            riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004", "6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008", "6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b", "6132710cfc13ae15b300000c", "6132710cfc13ae15b300000d", "6132710cfc13ae15b300000e", "6132710cfc13ae15b300000f"],
            heats: [
                {
                    id: 0,
                    riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004"],
                    state: 'finished',
                    results: [{
                        riderId: "6132710cfc13ae15b3000001",
                        color: 0,
                        value: 23
                    }, {
                        riderId: "6132710cfc13ae15b3000002",
                        color: 1,
                        value: 12
                    }, {
                        riderId: "6132710cfc13ae15b3000003",
                        color: 2,
                        value: 32
                    }, {
                        riderId: "6132710cfc13ae15b3000004",
                        color: 3,
                        value: 31
                    }]
                }, {
                    id: 1,
                    riders: ["6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008"],
                    state: 'running',
                    results: [{
                        riderId: "6132710cfc13ae15b3000005",
                        color: 0,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000006",
                        color: 1,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000007",
                        color: 2,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b3000008",
                        color: 3,
                        value: 0
                    }]
                }, {
                    id: 2,
                    riders: ["6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b"],
                    state: 'idle',
                    results: [{
                        riderId: "6132710cfc13ae15b3000009",
                        color: 0,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000a",
                        color: 1,
                        value: 0
                    }, {
                        riderId: "6132710cfc13ae15b300000b",
                        color: 2,
                        value: 0
                    }]
                }
            ]
        }
    ]
}
