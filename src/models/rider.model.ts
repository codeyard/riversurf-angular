import {Category} from "./category.model";

export class Rider {
    public id: number;
    public firstName: string;
    public lastName: string;
    public nickName: string;
    public birthdate: Date;
    public events: Event[];
    public category: Category;
    public email: string;
    public biography: string;
    public profilePicture: string;
    public facebookProfile: string;
    public instagramProfile: string;
    public twitterProfile: string;

    constructor(id: number, firstName: string, lastName: string, nickName: string, birthdate: Date, events: Event[], category: Category, email: string, biography: string, profilePicture: string, facebookProfile: string, instagramProfile: string, twitterProfile: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nickName = nickName;
        this.birthdate = birthdate;
        this.events = events;
        this.category = category;
        this.email = email;
        this.biography = biography;
        this.profilePicture = profilePicture;
        this.facebookProfile = facebookProfile;
        this.instagramProfile = instagramProfile;
        this.twitterProfile = twitterProfile;
    }

    get age(): number {
        let timeDiff = Math.abs(Date.now() - this.birthdate.getTime());
        return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    }
}
