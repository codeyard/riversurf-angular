import {Topic} from "./topic.type";

export interface GenericCollectionResponseModel<T> {
    topic: Topic;
    version: number;
    payload: T;
}
