import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'rs-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent {
    @ViewChild('navigationToggler', {static: false}) navigationToggler!: ElementRef;
    isChecked = false;

    toggleScrolling(isFromMenu: boolean): void {

        if (isFromMenu) {
            this.isChecked = false;
            document.body.style.overflow = 'visible';
        }

        if (!isFromMenu && !this.isChecked) {
            this.isChecked = true;
            document.body.style.overflow = 'hidden';
        }

        if (!isFromMenu && this.isChecked) {
            document.body.style.overflow = 'visible';
        }
    }

}
