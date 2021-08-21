import {Component, ViewChild} from '@angular/core';

@Component({
    selector: 'surf-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent {
    @ViewChild('navigation') navigation: any;
    navigationIsOpen: boolean = false;

    toggleNavigation(): void {
        this.navigationIsOpen = !this.navigationIsOpen;

        this.navigation.nativeElement.style.display = this.navigationIsOpen ? 'block' : 'none';
    }
}
