import {Component, OnInit} from '@angular/core';
import {WebSocketService} from "./core/services/web-socket.service";
import {UserService} from "./core/services/user.service";
import {RouterHistoryService} from "./core/services/router-history.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private webSocketService: WebSocketService, private userService: UserService, private routerHistoryService : RouterHistoryService) {
    }

    ngOnInit(): void {
        this.userService.autoLogin();
    }
}
