import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'rs-drop-zone',
    templateUrl: './drop-zone.component.html',
    styleUrls: ['./drop-zone.component.scss']
})
export class DropZoneComponent implements OnInit {

    @Input() itemLimit : Number = 4;

    constructor() {
    }

    ngOnInit(): void {
    }

}
