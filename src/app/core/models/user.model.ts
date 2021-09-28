import {Role} from "./role.type";
import {JwtHelperService} from "@auth0/angular-jwt";

export interface User {
    id: string;
    userName?: string;
    email?: string;
    userRole?: Role;
    profile?: string;
    token?: string;
    isAuthenticated?: boolean;
    favouriteRiders: string[];
}

export const examplejudge: User = {
    email: "miki@miki.ch",
    id: "example",
    userRole: 'judge',
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
        public id: string,
        public userName: string,
        public email: string,
        public userRole: Role,
        private tokenId: string,
    ) {
    }

    get token() {
        const helper = new JwtHelperService();
        const expirationDate = helper.getTokenExpirationDate(this.tokenId);
        if (!expirationDate || new Date() > expirationDate) {
            return null;
        }
        return this.tokenId;
    }
}


