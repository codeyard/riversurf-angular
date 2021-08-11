import {User} from "./user.model";
import {Competition} from "./competition.model";

export class Event {
    public id: number;
    public name: string;
    public description: string;
    public profilePicture: string;
    public startDateTime: Date;
    public endDateTime: Date;
    public location: string;
    public locationLat: number;
    public locationLong: number;
    public hashTag: string;
    public competitions: Competition[];
    public judge: User;
    public organizer: User;

    constructor(id: number, name: string, description: string, profilePicture: string, startDateTime: Date, endDateTime: Date, location: string, locationLat: number, locationLong: number, hashTag: string, competitions: Competition[], judge: User, organizer: User) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.profilePicture = profilePicture;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.location = location;
        this.locationLat = locationLat;
        this.locationLong = locationLong;
        this.hashTag = hashTag;
        this.competitions = competitions;
        this.judge = judge;
        this.organizer = organizer;
    }
}
