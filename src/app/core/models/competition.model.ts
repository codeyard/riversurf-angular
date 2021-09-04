import {Division} from "./division.type";
import {Color} from "./color.type";

export interface Competition {
    id: string;
    division: Division;
    maxRiders: number;
    rounds: Round[];
}

export interface Round {
    id: string;
    name?: string;
    index: number;
    heats: Heat[];
}

export interface Heat {
    id: string;
    index: number;
    results: Result[];
}

export interface Result {
    id: string;
    riderId: string;
    color: Color;
    value: number;
}

export const exampleComp: Competition = {
    division: 'male',
    id: "comp1",
    maxRiders: 1,
    rounds: [
        {
            id: 'round1_1',
            name: 'Seeding ROund',
            index: 0,
            heats: [
                {
                    id: 'heat_1_1_1',
                    index: 0,
                    results: [{
                        id: 'result1_1_1_1',
                        riderId: 'rider123',
                        color: Color.red,
                        value: 1
                    }]
                }
            ]
        }
    ]

}
