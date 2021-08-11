import {Role} from "./role.model";

export class User {
    public id: number;
    public userName: string;
    public password: string;
    public email: string;
    public role: Role;


    constructor(id: number, userName: string, password: string, email: string, role: Role) {
        this.id = id;
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.role = role;
    }
}
