import {Role} from "./role.type";
import {Rider} from "./rider.model";

export interface User {
    id: number;
    userName: string;
    password: string;
    email: string;
    role: Role;
    profile?: Rider;
}

export const examplejudge: User = {
    email: "miki@miki.ch",
    id: 0,
    password: "",
    role: 'judge',
    userName: "mikimaus"
}
