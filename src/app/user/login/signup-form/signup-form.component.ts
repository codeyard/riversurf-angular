import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SnackbarService} from "../../../common/snackbar.service";
import {ConfirmPasswordValidator} from "./confirm-password.validator";

@Component({
    selector: 'rs-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent implements OnInit {
    @Input() formMode!: string;
    hidePassword = true;
    hidePasswordConfirmation = true;
    signupForm: FormGroup = new FormGroup({});

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private snackBar: SnackbarService) {
    }

    ngOnInit(): void {
        if (this.formMode === 'register') {
            this.signupForm = this.formBuilder.group({
                email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
                username: ['', [Validators.required, Validators.minLength(5)]],
                password: ['', [Validators.required, Validators.minLength(5)]],
                passwordConfirmation: ['', [Validators.required, Validators.minLength(5)]]
            }, {
                validator: ConfirmPasswordValidator('password', 'passwordConfirmation')
            });
        } else {
            this.signupForm = this.formBuilder.group({
                username: ['', [Validators.required, Validators.minLength(5)]],
                password: ['', [Validators.required, Validators.minLength(5)]]
            });
        }
    }

    onSubmit() {
        // TODO: Send to backend
        this.snackBar.send(this.formMode === 'login'
                ? 'Login successful'
                : 'Successfully registered',
            'success'
        )
        this.router.navigate(["/"]).then();
    }
}
