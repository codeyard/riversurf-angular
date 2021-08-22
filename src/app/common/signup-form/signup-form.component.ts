import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SnackbarService} from "../snackbar.service";

@Component({
    selector: 'surf-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent implements OnInit {
    @Input()
    formMode!: string;
    hidePassword = true;
    signupForm!: FormGroup;

    constructor(private router: Router, private snackBar: SnackbarService) {
    }

    ngOnInit(): void {
        this.signupForm = new FormGroup({
            'username': new FormControl(null, [Validators.required, Validators.minLength(5)]),
            'password': new FormControl(null, [Validators.required, Validators.minLength(5)])
        });

        if (this.formMode === 'register') {
            this.signupForm
                .addControl(
                    'email', new FormControl(null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
                    ))
        }

    }

    onSubmit() {
        // TODO Send to backend
        this.snackBar.send(this.formMode === 'login'
                ? 'Login successful'
                : 'Successfully registered',
            'success'
        )
        this.router.navigate(["/"]);
    }
}
