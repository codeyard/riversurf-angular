import {Pipe, PipeTransform} from '@angular/core';
import {UserNotification} from "../../../models/user-notification.model";

@Pipe({
    name: 'newUserNotifications'
})
export class NewUserNotificationsPipe implements PipeTransform {

    transform(value: number): string {
        if(value >= 100){
            return '...';
        } else {
            return value.toString();
        }
    }

}
