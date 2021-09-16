import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'rs-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    selectedTabIndex: number = 0;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        if (this.router.url.includes('/register')) {
            this.selectedTabIndex = 1;
        }
    }

}
