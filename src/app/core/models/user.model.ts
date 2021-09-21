import {Role} from "./role.type";

export interface User {
    id: string;
    userName: string;
    password: string;
    email: string;
    role: Role;
    profile?: string;
    favouriteRiders: string[];
}

export const examplejudge: User = {
    email: "miki@miki.ch",
    id: "example",
    password: "",
    role: 'judge',
    userName: "mikimaus",
    favouriteRiders: []
}

export interface AuthResponseData {
    id: string,
    userName: string,
    email: string,
    userRole: Role,
    token: string
}

export class AuthUser {
    constructor(
        private id: string,
        private userName: string,
        private email: string,
        private userRole: Role,
        private tokenId: string,
    ) {}

    get token() {
        // TODO ADD LOGIK FOR VALIDATION OF TODO
        return this.tokenId;
    }
}


