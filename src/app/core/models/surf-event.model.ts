import {examplejudge} from "./user.model";
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

export const exampleEvent: SurfEvent = {
    competitions: ["comp1"],
    description: "Das ist die Beschreibung vom Event",
    endDateTime: new Date(),
    hashTag: "#riversurf, #thun",
    id: "riversurf-jam-thun-2021",
    judge: "examplejudge",
    location: "somewhere",
    locationLat: 0,
    locationLong: 0,
    name: "RiversurfJam",
    organizer: "examplejudge",
    mainPicture: "https://riversurfstorage.blob.core.windows.net/eventimages/event1.jpg",
    logo: "https://riversurfstorage.blob.core.windows.net/eventimages/logo_event1.jpg",
    startDateTime: new Date(),
    divisions: ["male", "female"]
}
