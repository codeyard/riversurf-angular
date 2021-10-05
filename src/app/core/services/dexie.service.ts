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
            users: "id",
            surfevents: "id",
            competitions: "id",
            versions: "topic"
        });
        this.db.version(2).stores({
            notifications: "++id"
        });
    }

    getDB() {
        return this.db;
    }

    getRidersTable() {
        return this.db.table('riders');
    }

    getVersionsTable() {
        return this.db.table('versions');
    }

    getCompetitionsTable() {
        return this.db.table('competitions');
    }

    getNotificationsTable(){
        return this.db.table('notifications');
    }
}
