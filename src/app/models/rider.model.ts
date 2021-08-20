import {Devision} from "./devision.type";

export interface Rider {
    id: string;
    firstName: string;
    lastName: string;
    nickName: string;
    birthdate: Date;
    events: Event[];
    category: Devision;
    email: string;
    biography: string;
    profilePicture: string;
    facebookProfile: string;
    instagramProfile: string;
    twitterProfile: string;

}


export const riderExample: Rider = {
    biography: "Schon lange dabei",
    birthdate: new Date(),
    category: Devision.male,
    email: "didi@riversurf.ch",
    events: [],
    facebookProfile: "facebook.com",
    firstName: "Dimitri",
    id: "rider123",
    instagramProfile: "instagram.com",
    lastName: "Scholl",
    nickName: "Didi",
    profilePicture: "https://riversurfstorage.blob.core.windows.net/riderimages/rider123.thumb.jpg",
    twitterProfile: "twitter.com"

}