import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {
    WebSocketDataPayload,
    WebSocketNotificationPayload,
    WebSocketSubscriptionPayload
} from "../models/websocket/web-socket-data.model";
import {UserNotificationService} from "./user-notification.service";
import {AppConfigService} from "./app-config.service";
import {UserService} from "./user.service";
import {NetworkStatusService} from "./network-status.service";
import {distinctUntilChanged, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {OutgoingMessageModel} from "../models/websocket/outgoing-message.model";
import {OutgoingSubscriptionPayload} from "../models/websocket/outgoing-subscription-payload.model";
import {SnackbarService} from "./snackbar.service";
import {OutgoingNotification} from "../models/websocket/OutgoingNotification";
import {OutgoingAuthenticationPayload} from "../models/websocket/outgoing-authentication-payload";

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    PROTOCOL = 'https://'
    PATH_ENDPOINT = '/api/ws/sessions';

    private webSocketData?: WebSocketSubject<any>;

    private MAP_TO_REMOTE_WEBSOCKET = true; // set to false, if you want to use your own websocket (on localhost)
    private WEBSOCKET_PORT_ON_LOCALHOST = 8080; // set the port number of your websocket when hosting on localhost

    constructor(private config: AppConfigService,
                private notificationService: UserNotificationService,
                private userService: UserService,
                private networkStatusService: NetworkStatusService,
                private httpClient: HttpClient,
                private appConfigService: AppConfigService,
                private snackBarService: SnackbarService
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

    private parseDataMessage(message: any) {
        const dataMessage: WebSocketDataPayload = {
            id: message.id,
            payload: {
                data: ''
            }
        };

        if (message.payload.data) {
            dataMessage.payload.data = message.payload.data;

            console.log(`Received data message`, dataMessage);
        }
    }

    private parseSubscriptionMessage(message: any) {
        const subscriptionMessage: WebSocketSubscriptionPayload = {
            id: message.id,
            payload: {
                riderIds: []
            }
        };

        if (message.payload.riderIds) {
            subscriptionMessage.payload.riderIds = message.payload.riderIds;

            console.log(`Received subscription message`, subscriptionMessage);
        }
    }

    private receiveMessage(message: any) {
        if (message.id && message.messageType && message.payload) {
            switch (message.messageType) {
                case "data":
                    this.parseDataMessage(message);
                    break;

                case "notification":
                    this.parseNotificationMessage(message);
                    break;

                default:
                    console.log(`Received unknown message type`, message);
                    break;
            }
        } else {
            console.log(`Received unknown message`, message);
        }
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
            notificationMessage.payload.surfEventName = message.payload.surfeventName;
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
                this.snackBarService.send("We couldn't update incoming live data for you", "error");
                console.log(`WebSocket Error`, err);
            },
            () => console.log(`WebSocket Complete`)
        );
    }

    private sendAuthMessage(token: string) {
        const outgoingAuthenticationPayload: OutgoingAuthenticationPayload = {
            baererToken: token
        }
        const outgoningMessage: OutgoingMessageModel = {
            messageType: "authentication",
            payload: outgoingAuthenticationPayload
        }
        this.webSocketData?.next(outgoningMessage);
    }

    private disconnect() {
        this.webSocketData?.unsubscribe();
        this.webSocketData?.complete();
    }
}
