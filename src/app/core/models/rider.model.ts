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


export const exampleRiderMale: Rider = {
    biography: "Schon lange dabei",
    birthdate: new Date('1975/6/19'),
    division: 'male',
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

export const exampleRiderFemale: Rider = {
    biography: "Lorem ipsum dolor sit amet",
    birthdate: new Date(),
    division: 'female',
    email: "susi@sorglos.ch",
    events: [],
    facebookProfile: "facebook.com",
    firstName: "Susi",
    id: "rider124",
    instagramProfile: "instagram.com",
    lastName: "Sorglos",
    nickName: "sisu",
    profilePicture: "https://riversurfstorage.blob.core.windows.net/riderimages/rider123.thumb.jpg",
    twitterProfile: "twitter.com"
}

export const exampleRiderKid: Rider = {
    biography: "Lorem ipsum dolor sit amet",
    birthdate: new Date(),
    division: 'kid',
    email: "johnnyh@cker.ch",
    events: [],
    facebookProfile: "facebook.com",
    firstName: "Jeremy Juan",
    id: "rider1254",
    instagramProfile: "instagram.com",
    lastName: "Guggisberg",
    nickName: "johnnyyyyy",
    profilePicture: "https://riversurfstorage.blob.core.windows.net/riderimages/rider123.thumb.jpg",
    twitterProfile: "twitter.com"
}
