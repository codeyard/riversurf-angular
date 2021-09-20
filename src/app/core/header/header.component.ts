import {Component} from '@angular/core';
import {WebSocketService} from "../services/web-socket.service";

@Component({
    selector: 'rs-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    constructor(private webSocketService : WebSocketService) {
    }
}
