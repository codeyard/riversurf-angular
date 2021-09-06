import {examplejudge, User} from "./user.model";
import {Competition, exampleComp} from "./competition.model";

export interface Event {
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
    competitions: Competition[];
    judge: User;
    organizer: User;
}

export const exampleEvent: Event = {
    competitions: [exampleComp, {...exampleComp, division:"female"}],
    description: "Das ist die Beschreibung vom Event",
    endDateTime: new Date(),
    hashTag: "riversurf-thun",
    id: "riversurf-jam-thun-2021",
    judge: examplejudge,
    location: "somewhere",
    locationLat: 46.761725,
    locationLong: 7.617745,
    name: "RiversurfJam",
    organizer: examplejudge,
    mainPicture: "https://riversurfstorage.blob.core.windows.net/eventimages/event1.jpg",
    logo: "https://riversurfstorage.blob.core.windows.net/eventimages/logo_event1.jpg",
    startDateTime: new Date()
}
