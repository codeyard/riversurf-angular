import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

export declare type MessageLevel = 'success' | 'error' | 'warning';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private readonly NOTIFICATION_SHOWTIME: number = 5000;

    constructor(private readonly snackbar: MatSnackBar) {
    }

    send(message: string, level: MessageLevel): void {

        this.snackbar.open(message, 'X', {
            duration: this.NOTIFICATION_SHOWTIME,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: [level]
        });
    }
}
