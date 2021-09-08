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
            id: "6132710cfc13ae15b3000001",
            firstName: "Pierrette",
            lastName: "Baltrushaitis",
            nickName: "instruction set",
            birthdate: new Date("2002-11-23"),
            division: "female",
            email: "pbaltrushaitis0@blogspot.com",
            events: [],
            biography: "Multi-layered 6th generation architecture",
            profilePicture: "https://robohash.org/ipsumutet.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b3000002",
            firstName: "Katerina",
            lastName: "Humphries",
            nickName: "coherent",
            birthdate: new Date("1999-08-06"),
            division: "male",
            email: "khumphries1@bigcartel.com",
            events: [],
            biography: "Optimized full-range protocol",
            profilePicture: "https://robohash.org/eligendiautvelit.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b3000003",
            firstName: "Skipper",
            lastName: "Pluvier",
            nickName: "strategy",
            birthdate: new Date("2001-04-25"),
            division: "male",
            email: "spluvier2@qq.com",
            events: [],
            biography: "Distributed modular internet solution",
            profilePicture: "https://robohash.org/quisofficiaea.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b3000004",
            firstName: "Milli",
            lastName: "Seager",
            nickName: "matrices",
            birthdate: new Date("2015-02-23"),
            division: "female",
            email: "mseager3@vimeo.com",
            events: [],
            biography: "Focused foreground open architecture",
            profilePicture: "https://robohash.org/omnisnonnecessitatibus.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b3000005",
            firstName: "Kenna",
            lastName: "Chessill",
            nickName: "throughput",
            birthdate: new Date("2018-11-21"),
            division: "male",
            email: "kchessill4@hibu.com",
            events: [],
            biography: "Object-based stable encoding",
            profilePicture: "https://robohash.org/advoluptateipsum.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b3000006",
            firstName: "Dyan",
            lastName: "Guilleton",
            nickName: "instruction set",
            birthdate: new Date("2015-09-04"),
            division: "male",
            email: "dguilleton5@gizmodo.com",
            events: [],
            biography: "Customizable holistic extranet",
            profilePicture: "https://robohash.org/distinctioasperioresut.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b3000007",
            firstName: "Shaw",
            lastName: "McIlreavy",
            nickName: "mobile",
            birthdate: new Date("2016-12-04"),
            division: "female",
            email: "smcilreavy6@unicef.org",
            events: [],
            biography: "Streamlined 5th generation paradigm",
            profilePicture: "https://robohash.org/omnislaboredeleniti.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b3000008",
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
            id: "6132710cfc13ae15b3000009",
            firstName: "Patrizia",
            lastName: "Manna",
            nickName: "zero defect",
            birthdate: new Date("1995-03-13"),
            division: "female",
            email: "pmanna8@reference.com",
            events: [],
            biography: "Networked foreground challenge",
            profilePicture: "https://robohash.org/sitreiciendisamet.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b300000a",
            firstName: "Lesley",
            lastName: "Northern",
            nickName: "Devolved",
            birthdate: new Date("1991-08-15"),
            division: "female",
            email: "lnorthern9@hibu.com",
            events: [],
            biography: "Digitized interactive forecast",
            profilePicture: "https://robohash.org/rerumetut.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b300000b",
            firstName: "Perice",
            lastName: "Hannah",
            nickName: "5th generation",
            birthdate: new Date("2011-12-02"),
            division: "male",
            email: "phannaha@sakura.ne.jp",
            events: [],
            biography: "Intuitive 5th generation throughput",
            profilePicture: "https://robohash.org/errorinqui.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b300000c",
            firstName: "Avril",
            lastName: "Garm",
            nickName: "website",
            birthdate: new Date("2009-03-11"),
            division: "male",
            email: "agarmb@sohu.com",
            events: [],
            biography: "User-centric zero administration hierarchy",
            profilePicture: "https://robohash.org/atquiipsam.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b300000d",
            firstName: "Kort",
            lastName: "Scoyles",
            nickName: "collaboration",
            birthdate: new Date("2007-09-01"),
            division: "female",
            email: "kscoylesc@springer.com",
            events: [],
            biography: "Universal fresh-thinking benchmark",
            profilePicture: "https://robohash.org/eumquiaenim.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b300000e",
            firstName: "Agace",
            lastName: "MacGebenay",
            nickName: "Diverse",
            birthdate: new Date("2006-10-10"),
            division: "male",
            email: "amacgebenayd@abc.net.au",
            events: [],
            biography: "Grass-roots dynamic standardization",
            profilePicture: "https://robohash.org/nullatemporelabore.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }, {
            id: "6132710cfc13ae15b300000f",
            firstName: "Merna",
            lastName: "Bundey",
            nickName: "Reactive",
            birthdate: new Date("1999-10-14"),
            division: "male",
            email: "mbundeye@list-manage.com",
            events: [],
            biography: "Reduced system-worthy contingency",
            profilePicture: "https://robohash.org/porronisiperspiciatis.jpg?size=300x300&set=set1",
            facebookProfile: "facebook.com",
            instagramProfile: "instagram.com",
            twitterProfile: "twitter.com"
        }
    ],
    rounds: [
        {
            id: 'round1_1',
            name: 'Seeding Round',
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
