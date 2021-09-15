import {Pipe, PipeTransform} from '@angular/core';
import {UserNotification} from "../../../models/user-notification.model";

@Pipe({
    name: 'newUserNotifications'
})
export class NewUserNotificationsPipe implements PipeTransform {

    transform(value: UserNotification[]): string {
        const numberofNewMessages = value.filter(m => !m.read).length;
        if(numberofNewMessages >= 100){
            return '...';
        } else {
            return numberofNewMessages.toString();
        }
    }

}
