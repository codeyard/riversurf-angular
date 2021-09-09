import {Role} from "./role.type";
import {Rider} from "./rider.model";

export interface User {
    id: string;
    userName: string;
    password: string;
    email: string;
    role: Role;
    profile?: string;
}

export const examplejudge: User = {
    email: "miki@miki.ch",
    id: "example",
    password: "",
    role: 'judge',
    userName: "mikimaus"
}
