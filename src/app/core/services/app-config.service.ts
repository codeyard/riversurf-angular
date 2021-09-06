import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private hostName!: string;

    constructor() {
    }

    setHostName(hostName: string) {
        this.hostName = hostName;
    }


    getHostName(): string {
        return this.hostName;
    }
}
