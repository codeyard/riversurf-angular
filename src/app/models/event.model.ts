import {User} from "./user.model";
import {Competition} from "./competition.model";

export interface Event {
    id: string;
    name: string;
    description: string;
    profilePicture: string;
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
