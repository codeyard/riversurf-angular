import {Injectable} from '@angular/core';
import {combineLatest} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {
    AuthSessionResponse,
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

/*
    Example data for the websocket when sending a notification:
    {
        "id" : "0",
        "type" : "notification",
        "payload" : {
            "notification" : {
                "timestamp" : "2021-09-20T20:28:52.512Z",
                "content" : "The next river surf jam in thun will be in 2022! Click on the link to see more details.",
                "link" : "/event/riversurfjam-thun-2022-613917dd771da527952a46a7"
            }
        }
    }
 */

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
        // ToDo: check if User is logged in, check if we are online
        const networkState$ = networkStatusService.getNetworkStatus();
        const authState$ = userService.getUser().pipe(map(user => user.isAuthenticated));

        combineLatest([networkState$, authState$])
            .pipe(distinctUntilChanged(([netprev, authprev], [netcurr, authcurr]) => {
                return netprev === netcurr && authprev === authcurr;
            }))
            .subscribe(([networkState, authState]) => {
                if (networkState === "ONLINE") {
                    if (authState) {
                        this.connectAuth();
                    } else {
                        this.connect();
                    }
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
                this.webSocketData?.next(outgoingMessage);
            });
    }

    parseDataMessage(message: any) {
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

    parseSubscriptionMessage(message: any) {
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

    private connectAuth() {
        const requestUrl = this.PROTOCOL + this.appConfigService.getHostName() + this.PATH_ENDPOINT;
        const body = {}
        return this.httpClient.post<AuthSessionResponse>(requestUrl, body)
            .subscribe(response => this.connect(response.sessionToken));
    }

    private connect(sessionToken?: string): void {
        this.webSocketData?.complete();

        sessionToken = sessionToken ?? "";

        let protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        let host = '';

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
}
