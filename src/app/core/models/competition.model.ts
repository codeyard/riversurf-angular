import {Division} from "./division.type";
import {Color} from "./color.type";

export interface Competition {
    id: string;
    division: Division;
    maxRiders: number;
    riders: string[];
    rounds: Round[];
}

export interface Round {
    id: number;
    name?: string;
    riders: string[];
    heats: Heat[];
}

export interface Heat {
    id: number;
    results?: Result[];
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
            name: 'Seeding Round',
            riders: [''],
            heats: [
                {
                    id: 1,
                    results: [{
                        id: 0,
                        riderId: 'rider123',
                        color: Color.red,
                        value: 1
                    }]
                }
            ]
        }
    ]
}
