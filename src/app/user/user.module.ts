import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from "./login/login.component";
import {SignupFormComponent} from "./login/signup-form/signup-form.component";
import {MatTabsModule} from "@angular/material/tabs";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
    declarations: [
        LoginComponent,
        SignupFormComponent
    ],
    imports: [
        CommonModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
    ],
    exports: [
        LoginComponent
    ]
})
export class UserModule {
}
