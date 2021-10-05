import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {WebSocketNotificationPayload} from "../models/websocket/web-socket-data.model";
import {UserNotificationService} from "./user-notification.service";
import {AppConfigService} from "./app-config.service";
import {UserService} from "./user.service";
import {NetworkStatusService} from "./network-status.service";
import {distinctUntilChanged, filter, map} from "rxjs/operators";
import {OutgoingMessageModel} from "../models/websocket/outgoing-message.model";
import {OutgoingSubscriptionPayload} from "../models/websocket/outgoing-subscription-payload.model";
import {OutgoingNotification, OutgoingNotificationWithId} from "../models/websocket/outgoing-notification.model";
import {OutgoingAuthenticationPayload} from "../models/websocket/outgoing-authentication-payload";
import {BehaviorSubject, Observable} from "rxjs";
import {IncomingMessage} from "../models/websocket/incoming-message.model";
import {DexieService} from "./dexie.service";
import {SnackbarService} from "./snackbar.service";


@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    private webSocketData?: WebSocketSubject<any>;

    private MAP_TO_REMOTE_WEBSOCKET = true; // set to false, if you want to use your own websocket (on localhost)
    private WEBSOCKET_PORT_ON_LOCALHOST = 8080; // set the port number of your websocket when hosting on localhost

    private recievedData = new BehaviorSubject<any>(null);
    private recievedData$ = this.recievedData.asObservable();

    private dexieDB: any;
    private isOffline: boolean = false;
    private userToken: string = '';

    constructor(private config: AppConfigService,
                private notificationService: UserNotificationService,
                private userService: UserService,
                private networkStatusService: NetworkStatusService,
                private dexieService: DexieService,
                private snackBarService: SnackbarService
    ) {
        this.dexieDB = dexieService.getDB();

        networkStatusService.getNetworkStatus().subscribe(networkstate => {
            this.isOffline = networkstate === 'OFFLINE';
            if (!this.isOffline) {
                this.connect();
            } else {
                this.disconnect();
            }
        });

        userService.getUser()
            .pipe(distinctUntilChanged((prevUser, nextUser) => prevUser.isAuthenticated === nextUser.isAuthenticated))
            .subscribe(user => {
                if (user.isAuthenticated) {
                    this.userToken = user.token ?? "";
                    this.sendAuthMessage(user.token ?? "");
                } else {
                    this.userToken = "";
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

    sendNotification(outgoingNotification: OutgoingNotification) {
        const outgoingMessage: OutgoingMessageModel = {
            messageType: "notification",
            payload: outgoingNotification
        }

        if (this.webSocketData !== undefined && !this.isOffline) {
            this.webSocketData?.next(outgoingMessage);
        } else {
            const storedMessage: OutgoingNotificationWithId = {
                notification: outgoingNotification
            }
            this.dexieDB.notifications.put(storedMessage);
        }
    }

    getUpdatedAboutTopic(topic: string): Observable<any> {
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
            notificationMessage.payload.surfEventName = message.payload.surfeventName;
            notificationMessage.payload.timestamp = message.payload.timestamp;
            notificationMessage.payload.content = message.payload.content;
            notificationMessage.payload.link = message.payload.link;

            this.notificationService.showNotification(notificationMessage.payload);
        }
    }

    private connect(): void {
        if (this.webSocketData?.closed !== true) {
            this.disconnect();
        }

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

        const webSocketUrl = protocol + host + '/ws';

        this.webSocketData = webSocket(webSocketUrl);
        this.webSocketData.subscribe(
            msg => this.receiveMessage(msg),
            err => {
                console.log(`WebSocket Error`, err);
            },
            () => console.log(`WebSocket Complete`)
        );

        if (this.userToken) {
            this.sendAuthMessage(this.userToken);
        }

        this.dexieDB.notifications.toArray().then((outgoingNotifications: OutgoingNotificationWithId[]) => {
            if (outgoingNotifications.length > 0) {
                const deletions: Promise<any>[] = [];
                outgoingNotifications.forEach(outgoingNotification => {
                    this.sendNotification(outgoingNotification.notification);
                    deletions.push(this.dexieDB.notifications.delete(outgoingNotification.id));
                });
                Promise.all(deletions).then(() => {
                    this.dexieDB.notifications.toArray().then((outgoingNotifications: OutgoingNotificationWithId[]) => {
                        if (outgoingNotifications.length === 0) {
                            this.snackBarService.send("Welcome Back Online. All notifications were sent to the server!", "success")
                        } else {
                            this.snackBarService.send("We could not save your notifications on the server!", "error")
                        }
                    });
                });
            }
        });
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
