import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {

    private protocol!: string;
    private hostName!: string;

    constructor() {
    }

    setHostName(hostName: string) {
        this.hostName = hostName;
    }


    getHostName(): string {
        return this.hostName;
    }


    getProtocol(): string {
        return this.protocol;
    }

    setProtocol(protocol: string) {
        this.protocol = protocol;
    }
}
