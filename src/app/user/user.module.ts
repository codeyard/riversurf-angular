import {CommonModule} from '@angular/common';
import {LoginComponent} from "./login/login.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTabsModule} from "@angular/material/tabs";
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {SignupFormComponent} from "./login/signup-form/signup-form.component";


@NgModule({
    declarations: [
        LoginComponent,
        SignupFormComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        ReactiveFormsModule,
    ],
    exports: [
        LoginComponent
    ]
})
export class UserModule {
}
