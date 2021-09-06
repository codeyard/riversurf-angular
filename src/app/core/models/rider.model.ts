import {Division} from "./division.type";

export interface Rider {
    id: string;
    firstName: string;
    lastName: string;
    nickName: string;
    birthdate: Date;
    events: Event[];
    division: Division;
    email: string;
    biography: string;
    profilePicture: string;
    facebookProfile: string;
    instagramProfile: string;
    twitterProfile: string;
}
