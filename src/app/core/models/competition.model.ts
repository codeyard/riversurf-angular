import {Division} from "./division.type";
import {Color} from "./color.type";
import {Rider} from "./rider.model";

export interface Competition {
    id: string;
    division: Division;
    maxRiders: number;
    riders: Rider[];
    rounds: Round[];
}

export interface Round {
    id: string;
    name?: string;
    index: number;
    heats: Heat[];
}

export interface Heat {
    id: string;
    index: number;
    results: Result[];
}

export interface Result {
    id: string;
    riderId: string;
    color: Color;
    value: number;
}

export const exampleComp: Competition = {
    division: 'male',
    id: "comp1",
    maxRiders: 20,
    riders: [
        {
            id: "6132710cf12c13ae15fdgdb3000008",
            firstName: "Raimund",
            lastName: "Tesdale",
            nickName: "24 hour",
            birthdate: new Date("2020-05-23"),
            division: "female",
            email: "rtesdale7@simplemachines.org",
            events: [],
            biography: "Open-architected 5th generation hub",
            profilePicture: "https://robohash.org/ducimusfugiatsunt.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae132445b3000008",
            firstName: "Raimund",
            lastName: "Tesdale",
            nickName: "24 hour",
            birthdate: new Date("2020-05-23"),
            division: "female",
            email: "rtesdale7@simplemachines.org",
            events: [],
            biography: "Open-architected 5th generation hub",
            profilePicture: "https://robohash.org/ducimusfugiatsunt.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b300ztuzt0008",
            firstName: "Raimund",
            lastName: "Tesdale",
            nickName: "24 hour",
            birthdate: new Date("2020-05-23"),
            division: "female",
            email: "rtesdale7@simplemachines.org",
            events: [],
            biography: "Open-architected 5th generation hub",
            profilePicture: "https://robohash.org/ducimusfugiatsunt.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15kjjhkb3000008",
            firstName: "Raimund",
            lastName: "Tesdale",
            nickName: "24 hour",
            birthdate: new Date("2020-05-23"),
            division: "female",
            email: "rtesdale7@simplemachines.org",
            events: [],
            biography: "Open-architected 5th generation hub",
            profilePicture: "https://robohash.org/ducimusfugiatsunt.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae1dsffd5b3000008",
            firstName: "Raimund",
            lastName: "Tesdale",
            nickName: "24 hour",
            birthdate: new Date("2020-05-23"),
            division: "female",
            email: "rtesdale7@simplemachines.org",
            events: [],
            biography: "Open-architected 5th generation hub",
            profilePicture: "https://robohash.org/ducimusfugiatsunt.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15ghgb3000008",
            firstName: "Raimund",
            lastName: "Tesdale",
            nickName: "24 hour",
            birthdate: new Date("2020-05-23"),
            division: "female",
            email: "rtesdale7@simplemachines.org",
            events: [],
            biography: "Open-architected 5th generation hub",
            profilePicture: "https://robohash.org/ducimusfugiatsunt.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b3adsa000008",
            firstName: "Raimund",
            lastName: "Tesdale",
            nickName: "24 hour",
            birthdate: new Date("2020-05-23"),
            division: "female",
            email: "rtesdale7@simplemachines.org",
            events: [],
            biography: "Open-architected 5th generation hub",
            profilePicture: "https://robohash.org/ducimusfugiatsunt.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b300fdfs0008",
            firstName: "Raimund",
            lastName: "Tesdale",
            nickName: "24 hour",
            birthdate: new Date("2020-05-23"),
            division: "female",
            email: "rtesdale7@simplemachines.org",
            events: [],
            biography: "Open-architected 5th generation hub",
            profilePicture: "https://robohash.org/ducimusfugiatsunt.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }
    ],
    rounds: [
        {
            id: 'round1_1',
            name: 'Seeding ROund',
            index: 0,
            heats: [
                {
                    id: 'heat_1_1_1',
                    index: 0,
                    results: [{
                        id: 'result1_1_1_1',
                        riderId: 'rider123',
                        color: Color.red,
                        value: 1
                    }]
                }
            ]
        }
    ]

}
