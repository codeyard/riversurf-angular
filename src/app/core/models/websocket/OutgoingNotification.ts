export interface OutgoingNotification {
    surfEventName: string;
    topic : string;
    action: string;
    timestamp: string;
    riders: string[];
    link: string;
}
