import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'rs-drop-zone-item',
    templateUrl: './drop-zone-item.component.html',
    styleUrls: ['./drop-zone-item.component.scss']
})
export class DropZoneItemComponent implements OnInit, AfterViewInit {

    private placeholder: boolean = true;

    @ViewChild('content') content !: ElementRef;

    constructor() {
    }

    ngOnInit(): void {
    }

    get Placeholder(): boolean {
        return this.placeholder;
    }

    ngAfterViewInit(): void {
        console.log(`content`, this.content);
        if(this.content?.nativeElement?.childNodes?.length > 0){
            this.placeholder = false;
        }
    }

}
