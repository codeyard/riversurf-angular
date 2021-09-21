export interface UserNotification {
    timestamp: Date;
    content: string;
    link?: string;
    read: boolean;
}
