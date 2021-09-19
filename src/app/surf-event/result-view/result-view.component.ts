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
    source: Point,
    target: Point,
    path: string,
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

    CURVE_RADIUS = 20;
    VARIANZ = 0;
    VARIANZ_OFFSET = 0;


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
        this.getPointsAndLines()
        this.cd.detectChanges();
        this.loaded = true;
    }

    ngAfterViewChecked() {

    }

    getPointsAndLines() {
        //DISCUSS: SHOULD THIS ALWAYS BE EQUAL TO THIS.COMPETITION.RIDERS? IF SO REMOVE FROM CODE, SO FAR UNUSED
        const ridersWithResult: string[] = []
        this.competition.rounds.forEach(round =>
            round.heats.forEach(heat =>
                heat.results.forEach(result => !ridersWithResult.includes(result.riderId) ? ridersWithResult.push(result.riderId) : '')
            )
        )


        for (const rider of this.competition.riders) {
            let points: Point[] = [];
            this.results.forEach(resultElementRef => {
                if (resultElementRef.riderId === rider) {
                    const leftPoint = {
                        x: resultElementRef.elementRef.nativeElement.offsetLeft,
                        y: resultElementRef.elementRef.nativeElement.offsetTop + this.RIDER_HEIGHT
                    }
                    const rightPoint = {
                        ...leftPoint,
                        x: resultElementRef.elementRef.nativeElement.offsetLeft + this.RIDER_WIDTH
                    }

                    if (resultElementRef.roundNumber === 0) {
                        points.push(rightPoint)
                        this.points.push(rightPoint)
                    } else if (resultElementRef.roundNumber === (this.competition.rounds.length - 1)) {
                        points.push(leftPoint)
                        this.points.push(leftPoint)
                    } else {
                        points.push(leftPoint, rightPoint)
                        this.points.push(leftPoint, rightPoint)
                    }
                }
            })

            for (let i = 0; i < points.length; i += 2) {
                try {
                    let {a, b} = this.extractPoints(points, i);
                    let path = this.calculatePath(a, b);
                    this.lines.push({
                        source: a,
                        target: b,
                        path: path
                    })
                } catch (notLineException) {
                    // EMPTY AS NO NEED TO ADD LINE
                }
            }

        }
    }

    private extractPoints(points: Point[], i: number): { a: Point, b: Point } {
        return {
            a: {
                x: points[i].x,
                y: points[i].y
            },
            b: {
                x: points[i + 1].x,
                y: points[i + 1].y
            }

        }
        console.log(this.lines)
        console.log(this.points)
    }


    private calculatePath(a: Point, b: Point) {

        const deltaX = b.x - a.x;
        const varianz = Math.random() * this.VARIANZ + this.VARIANZ_OFFSET;
        const middleX = a.x + (deltaX / 2) + varianz;
        console.log("middleX:", middleX);
        let deltaY = b.y - a.y;
        let middleY = a.y + (deltaY / 2);
        let signY = Math.sign(deltaY)
        // TODO: funktionert momentan nur für horizontale verbindungen, für vertikale, muss wohl auch noch ein signX eingesetzt werden
        // M 0 0 L 1 0 Q 2 0 2 1 L 2 2 L 2 3 Q 2 4 3 4 L 4 4
        let path = `M ${a.x} ${a.y}, L ${middleX - this.CURVE_RADIUS} ${a.y}, Q ${middleX} ${a.y} ${middleX} ${a.y + signY * this.CURVE_RADIUS}, L ${middleX} ${middleY}, L ${middleX} ${b.y - signY * this.CURVE_RADIUS}, Q ${middleX} ${b.y} ${middleX + this.CURVE_RADIUS} ${b.y}, L ${b.x} ${b.y}`;
        return path;
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
