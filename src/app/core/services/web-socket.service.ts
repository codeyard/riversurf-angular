import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {
    WebSocketNotificationPayload
} from "../models/websocket/web-socket-data.model";
import {UserNotificationService} from "./user-notification.service";
import {AppConfigService} from "./app-config.service";
import {UserService} from "./user.service";
import {NetworkStatusService} from "./network-status.service";
import {distinctUntilChanged, filter, map} from "rxjs/operators";
import {OutgoingMessageModel} from "../models/websocket/outgoing-message.model";
import {OutgoingSubscriptionPayload} from "../models/websocket/outgoing-subscription-payload.model";
import {OutgoingNotification} from "../models/websocket/OutgoingNotification";
import {OutgoingAuthenticationPayload} from "../models/websocket/outgoing-authentication-payload";
import {BehaviorSubject, Observable} from "rxjs";
import {IncomingMessage} from "../models/websocket/incoming-message.model";

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    private webSocketData?: WebSocketSubject<any>;

    private MAP_TO_REMOTE_WEBSOCKET = true; // set to false, if you want to use your own websocket (on localhost)
    private WEBSOCKET_PORT_ON_LOCALHOST = 8080; // set the port number of your websocket when hosting on localhost

    private recievedData = new BehaviorSubject<any>(null);
    private recievedData$ = this.recievedData.asObservable();

    constructor(private config: AppConfigService,
                private notificationService: UserNotificationService,
                private userService: UserService,
                private networkStatusService: NetworkStatusService
    ) {
        networkStatusService.getNetworkStatus().subscribe(networkstate => {
            if (networkstate === "ONLINE") {
                this.connect();
            } else {
                this.disconnect();
            }
        });


        userService.getUser()
            .pipe(distinctUntilChanged((prevUser, nextUser) => prevUser.isAuthenticated === nextUser.isAuthenticated))
            .subscribe(user => {
                if (user.isAuthenticated) {
                    this.sendAuthMessage(user.token ?? "");
                } else {
                    this.sendAuthMessage("");
                }
            });

        this.userService.getUser()
            .pipe(map(user => user.favouriteRiders))
            .subscribe(favouriteRiders => {
                const outgoingSubscriptionPayload: OutgoingSubscriptionPayload = {
                    riderIds: favouriteRiders
                }
                const outgoingMessage: OutgoingMessageModel = {
                    messageType: "subscription",
                    payload: outgoingSubscriptionPayload
                }
                if (this.webSocketData) {
                    this.webSocketData.next(outgoingMessage);
                }
            });
    }

    public sendNotification(outgoingNotification: OutgoingNotification) {
        const outgoingMessage: OutgoingMessageModel = {
            messageType: "notification",
            payload: outgoingNotification
        }
        this.webSocketData?.next(outgoingMessage)
    }

    public getUpdatedAboutTopic(topic: string): Observable<any> {
        return this.recievedData$.pipe(
            filter(data => !!data),
            map(data => data[topic]),
            filter(topic => topic !== undefined)
        );
    }

    private receiveMessage(message: IncomingMessage) {
            switch (message.messageType) {
                case "data":
                    this.parseDataMessage(message.payload);
                    break;

                case "notification":
                    this.parseNotificationMessage(message);
                    break;

                default:
                    console.log(`Received unknown message type`, message);
                    break;
            }
    }

    private parseDataMessage(payload: any) {
        this.recievedData.next(payload);
    }

    private parseNotificationMessage(message: any) {
        const notificationMessage: WebSocketNotificationPayload = {
            id: message.id,
            payload: {
                surfEventName: '',
                timestamp: new Date(),
                content: '',
                read: false
            }
        };

        if (message.payload.timestamp && message.payload.content) {
            notificationMessage.payload.surfEventName = message.payload.surfEventName;
            notificationMessage.payload.timestamp = message.payload.timestamp;
            notificationMessage.payload.content = message.payload.content;
            notificationMessage.payload.link = message.payload.link;

            this.notificationService.showNotification(notificationMessage.payload);
        }
    }

    private connect(sessionToken?: string): void {
        if (this.webSocketData?.closed !== true) {
            this.disconnect();
        }

        sessionToken = sessionToken ?? "";

        let protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        let host = 'localhost';

        if (this.MAP_TO_REMOTE_WEBSOCKET) {
            host = this.config.getHostName();
            protocol = "wss://";
        } else {
            if (host.startsWith('localhost')) {
                host = window.location.hostname + ':' + this.WEBSOCKET_PORT_ON_LOCALHOST.toString();
            } else {
                host = window.location.host;
            }
        }

        const webSocketUrl = protocol + host + '/ws?sessionToken=' + sessionToken;

        this.webSocketData = webSocket(webSocketUrl);
        this.webSocketData.subscribe(
            msg => this.receiveMessage(msg),
            err => {
                console.log(`WebSocket Error`, err);
            },
            () => console.log(`WebSocket Complete`)
        );
    }

    private sendAuthMessage(token: string) {
        const outgoingAuthenticationPayload: OutgoingAuthenticationPayload = {
            bearerToken: token
        }
        const outgoingMessage: OutgoingMessageModel = {
            messageType: "authentication",
            payload: outgoingAuthenticationPayload
        }
        this.webSocketData?.next(outgoingMessage);
    }

    private disconnect() {
        this.webSocketData?.unsubscribe();
        this.webSocketData?.complete();
    }
}
