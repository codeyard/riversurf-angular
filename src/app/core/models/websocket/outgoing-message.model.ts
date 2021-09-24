import {MessageType} from "./message-type.type";

export interface OutgoingMessageModel {
    messageType: MessageType,
    payload: any;
}
