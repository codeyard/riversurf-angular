import {Injectable} from '@angular/core';
import Dexie from "dexie";

@Injectable({
    providedIn: 'root'
})
export class DexieService {

    private db;

    constructor() {
        this.db = new Dexie("riverSurfDB");
        this.db.version(1).stores({
            riders: "id",
            user: "id",
            surfevents: "id",
            competitions: "id",
            versions: "topic"
        });
    }

    public getDB() {
        return this.db;
    }

    public getRidersTable() {
        return this.db.table('riders');
    }

    public getVersionsTable() {
        return this.db.table('versions');
    }

    public getCompetitionsTable() {
        return this.db.table('competitions');
    }
}
