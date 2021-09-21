import {Component} from '@angular/core';
import {WebSocketService} from "./core/services/web-socket.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private webSocketService: WebSocketService) {
    }
}
