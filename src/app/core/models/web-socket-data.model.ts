import {UserNotification} from "./user-notification.model";

export interface WebSocketDataPayload{
    id: string;
    payload: {
        data: string;
    };
}

export interface WebSocketSubscriptionPayload{
    id: string;
    payload: {
        riderIds : string[];
    };
}

export interface WebSocketNotificationPayload{
    id: string;
    payload: {
        notification : UserNotification;
    };
}
