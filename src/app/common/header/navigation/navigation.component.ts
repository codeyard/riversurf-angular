import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'surf-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent {
    @ViewChild('navigationToggler', {static: false}) navigationToggler!: ElementRef;
    isChecked = false;

    toggleScrolling(): void {
        this.isChecked = !this.isChecked;
        this.isChecked
        ?  document.body.style.overflow = 'hidden'
        : document.body.style.overflow = 'visible';
    }
}
