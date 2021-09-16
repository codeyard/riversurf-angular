import {Division} from "./division.type";

export interface Competition {
    id: string;
    division: Division;
    maxRiders: number;
    riders: string[];
    rounds: Round[];
}

export interface Round {
    id: number;
    riders: string[];
    heats: Heat[];
}

export type HeatState = 'idle' | 'running' | 'finished' | 'completed';

export interface Heat {
    id: number;
    riders: string[];
    state: HeatState;
    results: Result[];
}

export interface Result {
    id?: number;
    riderId: string;
    color: number;
    value: number;
}

export const exampleComp: Competition = {
    division: 'male',
    id: "comp1",
    maxRiders: 20,
    riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004", "6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008", "6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b", "6132710cfc13ae15b300000c", "6132710cfc13ae15b300000d", "6132710cfc13ae15b300000e", "6132710cfc13ae15b300000f"],
    rounds: [
        {
            id: 0,
            riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004", "6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008", "6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b", "6132710cfc13ae15b300000c", "6132710cfc13ae15b300000d", "6132710cfc13ae15b300000e", "6132710cfc13ae15b300000f"],
            heats: [
                {
                    id: 1,
                    riders: ["6132710cfc13ae15b3000001", "6132710cfc13ae15b3000002", "6132710cfc13ae15b3000003", "6132710cfc13ae15b3000004"],
                    state: 'finished',
                    results: [{
                        riderId: "6132710cfc13ae15b3000001",
                        color: 0,
                        value: 23
                    },{
                        riderId: "6132710cfc13ae15b3000002",
                        color: 1,
                        value: 12
                    },{
                        riderId: "6132710cfc13ae15b3000003",
                        color: 2,
                        value: 32
                    },{
                        riderId: "6132710cfc13ae15b3000004",
                        color: 3,
                        value: 31
                    }]
                },{
                    id: 2,
                    riders: ["6132710cfc13ae15b3000005", "6132710cfc13ae15b3000006", "6132710cfc13ae15b3000007", "6132710cfc13ae15b3000008"],
                    state: 'running',
                    results: [{
                        riderId: "6132710cfc13ae15b3000005",
                        color: 0,
                        value: 0
                    },{
                        riderId: "6132710cfc13ae15b3000006",
                        color: 1,
                        value: 0
                    },{
                        riderId: "6132710cfc13ae15b3000007",
                        color: 2,
                        value: 0
                    },{
                        riderId: "6132710cfc13ae15b3000008",
                        color: 3,
                        value: 0
                    }]
                },{
                    id: 3,
                    riders: ["6132710cfc13ae15b3000009", "6132710cfc13ae15b300000a", "6132710cfc13ae15b300000b"],
                    state: 'idle',
                    results: [{
                        riderId: "6132710cfc13ae15b3000009",
                        color: 0,
                        value: 0
                    },{
                        riderId: "6132710cfc13ae15b300000a",
                        color: 1,
                        value: 0
                    },{
                        riderId: "6132710cfc13ae15b300000b",
                        color: 2,
                        value: 0
                    }]
                }
            ]
        }
    ]
}
