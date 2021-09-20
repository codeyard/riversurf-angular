import {Injectable} from '@angular/core';
import {Subscription} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {
    WebSocketDataPayload,
    WebSocketNotificationPayload,
    WebSocketSubscriptionPayload
} from "../models/web-socket-data.model";
import {UserNotificationService} from "./user-notification.service";
import {AppConfigService} from "./app-config.service";

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

    private webSocketData?: WebSocketSubject<any>;
    private webSocketSubscription?: Subscription;

    private MAP_TO_REMOTE_WEBSOCKET = true; // set to false, if you want to use your own websocket (on localhost)
    private WEBSOCKET_PORT_ON_LOCALHOST = 8080; // set the port number of your websocket when hosting on localhost

    constructor(private config: AppConfigService, private notificationService: UserNotificationService) {
        // ToDo: Add default credentials to get a session token
        this.connect();
    }

    // ToDo: Add user-credentials to get a session token from the server
    connect() {
        this.webSocketSubscription?.unsubscribe();
        this.webSocketData?.unsubscribe();

        // ToDo: connect to the websocket server to gather a session token
        const sessionToken = '123';

        const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        let host = '';

        if(this.MAP_TO_REMOTE_WEBSOCKET){
            host = this.config.getHostName();
        } else {
            if (host.startsWith('localhost')) {
                host = window.location.hostname + ':' + this.WEBSOCKET_PORT_ON_LOCALHOST.toString();
            } else {
                host = window.location.host;
            }
        }

        const webSocketUrl = protocol + host + '/name?sessionToken=' + sessionToken;

        this.webSocketData = webSocket(webSocketUrl);
        this.webSocketSubscription = this.webSocketData.subscribe(
            msg => this.receiveMessage(msg),
            err => console.log(`WebSocket Error`, err),
            () => console.log(`WebSocket Complete`)
        );
    }

    private receiveMessage(message: any) {
        if (message.id && message.type && message.payload) {
            switch (message.type) {
                case "data":
                    this.parseDataMessage(message);
                    break;

                case "subscription":
                    this.parseSubscriptionMessage(message);
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

    private parseNotificationMessage(message: any) {
        const notificationMessage: WebSocketNotificationPayload = {
            id: message.id,
            payload: {
                notification: {
                    timestamp: new Date(),
                    content: '',
                    read: false
                }
            }
        };

        if (message.payload.notification.timestamp && message.payload.notification.content) {
            notificationMessage.payload.notification.timestamp = message.payload.notification.timestamp;
            notificationMessage.payload.notification.content = message.payload.notification.content;
            notificationMessage.payload.notification.link = message.payload.notification.link;

            this.notificationService.sendNotification(notificationMessage.payload.notification);
        }
    }
}
