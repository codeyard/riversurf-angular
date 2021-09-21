import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SnackbarService} from "../../../core/services/snackbar.service";
import {ConfirmPasswordValidator} from "./confirm-password.validator";
import {UserService} from "../../../core/services/user.service";

@Component({
    selector: 'rs-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent implements OnInit {
    @Input() formMode!: string;
    isLoading = false;
    hidePassword = true;
    hidePasswordConfirmation = true;
    signupForm: FormGroup = new FormGroup({});

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private snackBar: SnackbarService,
        private userService: UserService) {
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
        this.isLoading = true;
        this.formMode === 'login'
            ? this.loginUser()
            : this.registerUser()
    }

    loginUser() {
        const username = this.signupForm.get('username')?.value;
        const password = this.signupForm.get('password')?.value;
        this.userService.loginUser(username, password).subscribe((responseData) => {
                this.snackBar.send("Login successful", "success");
                this.isLoading = false;
                this.router.navigate(["/"])
            },
            errorMessage => {
                this.snackBar.send(errorMessage, "error");
                this.isLoading = false;
            }
        );
    }


    registerUser() {

    }
}
