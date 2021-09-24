import {Division} from "./division.type";

export interface SurfEvent {
    id: string;
    name: string;
    description: string;
    logo: string;
    mainPicture: string;
    startDateTime: Date;
    endDateTime: Date;
    location: string;
    locationLat: number;
    locationLong: number;
    hashTag: string;
    competitions: string[];
    judge: string;
    organizer: string;
    divisions: Division[];
}
