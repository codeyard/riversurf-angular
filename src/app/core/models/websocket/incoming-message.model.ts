import {MessageType} from "./message-type.type";

export interface IncomingMessage {
    id: string;
    messageType: MessageType;
    payload: any;
}
