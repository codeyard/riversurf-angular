import {Component} from '@angular/core';
import {WebSocketService} from "./core/services/web-socket.service";
import {UserService} from "./core/services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

    constructor(private webSocketService: WebSocketService, private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService.autoLogin();
    }
}
