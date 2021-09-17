import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    QueryList,
    ViewChildren
} from '@angular/core';
import {Competition, Heat} from "../../core/models/competition.model";
import {RiderResultComponent} from "../surf-event/competition/round/rider-result/rider-result.component";

export interface Line {
    x1: number,
    x2: number,
    y1: number,
    y2: number
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

    }

    ngAfterViewChecked() {
        //this.getLine()
        this.cd.detectChanges();
        this.loaded = true;
    }

    getLine() {
        let tempArray1 = this.competition.rounds[0].heats.map(heat => heat.results.map(result => result));
        let tempArray2 = this.competition.rounds[1].heats.map(heat => heat.results.map(result => result));
        let resultsFirstRound = tempArray1.reduce((acc, val) => acc.concat(val), []);
        let resultSecondRound = tempArray2.reduce((acc, val) => acc.concat(val), []);
        let result = resultsFirstRound.filter(result1 => resultSecondRound.some((result2 => result1.riderId === result2.riderId)));

        for (let riderResult of result) {
            let points: Point[] = [];
            this.results.forEach(result => {
                console.log("ChildrenResult", result)
                if (result.riderId === riderResult.riderId) {
                    points.push({
                        x: result.elementRef.nativeElement.offsetLeft,
                        y: result.elementRef.nativeElement.offsetTop
                    })
                }
            });
            this.lines.push({
                x1: points[0].x,
                y1: points[0].y,
                x2: points[1].x,
                y2: points[1].y
            })
        }
        console.log('lines', this.lines);
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
        }
    ]
}
