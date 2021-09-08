import {
    Component,
    ContentChild,
    Directive,
    ElementRef,
    OnInit,
    TemplateRef
} from '@angular/core';

@Directive({
    selector: '[rs-drop-zone-item-content]'
})
export class DropZoneItemContentDirective {
    constructor(public templateRef: TemplateRef<unknown>, public elementRef: ElementRef) {
    }
}

@Component({
    selector: 'rs-drop-zone-item',
    templateUrl: './drop-zone-item.component.html',
    styleUrls: ['./drop-zone-item.component.scss']
})
export class DropZoneItemComponent implements OnInit {

    @ContentChild(DropZoneItemContentDirective) content !: DropZoneItemContentDirective;

    constructor() {
    }

    ngOnInit(): void {
    }

}
