import {
    Component,
    ContentChild,
    Directive,
    OnInit,
    TemplateRef
} from '@angular/core';

@Directive({
    selector: '[rs-drop-zone-item-content]'
})
export class DropZoneContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {
    }
}

@Component({
    selector: 'rs-drop-zone-item',
    templateUrl: './drop-zone-content.component.html',
    styleUrls: ['./drop-zone-content.component.scss']
})
export class DropZoneContentComponent implements OnInit {

    @ContentChild(DropZoneContentDirective) content !: DropZoneContentDirective;

    constructor() {
    }

    ngOnInit(): void {
    }
}
