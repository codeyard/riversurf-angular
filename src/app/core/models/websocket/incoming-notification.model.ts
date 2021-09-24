export interface IncomingNotification {
    surfEventName: string;
    timestamp: Date;
    content: string;
    link?: string;
    read: boolean;
}
