import {Division} from "./division.type";

export interface Competition {
    id: string;
    version: number;
    division: Division;
    config: CompetitionConfig;
    riders: string[];
    rounds: Round[];
}

export interface CompetitionConfig {
    maxRiders: number;
    maxRidersInHeat: number;
    winnersInHeat: number;
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
