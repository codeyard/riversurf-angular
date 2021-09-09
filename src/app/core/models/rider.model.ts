import {SurfEvent} from "./surf-event.model";
import {Division} from "./division.type";

export interface Rider {
    id: string;
    firstName: string;
    lastName: string;
    nickName: string;
    birthdate: Date;
    surfEvents: SurfEvent[];
    division: Division;
    email: string;
    biography: string;
    profilePicture: string;
    facebookProfile: string;
    instagramProfile: string;
    twitterProfile: string;
}
