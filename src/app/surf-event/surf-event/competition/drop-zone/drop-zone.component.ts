import {
    AfterContentInit,
    Component,
    ContentChildren, ElementRef,
    Input, OnChanges,
    OnInit,
    QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren
} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {DropZoneContentComponent} from "./drop-zone-content/drop-zone-content.component";
import {DropZoneItemModel, placeholderDropZoneItem} from "./drop-zone-item.model";

@Component({
    selector: 'rs-drop-zone',
    templateUrl: './drop-zone.component.html',
    styleUrls: ['./drop-zone.component.scss']
})
export class DropZoneComponent implements OnInit, OnChanges {

    @Input() itemLimit: number = 4;

    dropZoneItems : DropZoneItemModel[] = [];

    constructor() {
        for(let i = 0; i < this.itemLimit; i++){
            this.dropZoneItems[i] = {...placeholderDropZoneItem};
        }
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(`Changes!`, changes);
        if (changes.itemLimit.currentValue != changes.itemLimit.previousValue &&
            changes.itemLimit.currentValue != undefined
            && this.dropZoneItems.length != this.itemLimit) {

            // reduce
            if (this.dropZoneItems.length > this.itemLimit) {

                // remove all placeholders (will be added at extending)
                this.dropZoneItems = this.dropZoneItems.filter(x=>x.id===-1);

                // over limit even after removing the placeholders?
                if (this.dropZoneItems.length > this.itemLimit) {
                    this.dropZoneItems.length = this.itemLimit;
                }
            }

            // extending
            if (this.dropZoneItems.length < this.itemLimit) {
                for (let i = this.dropZoneItems.length; i < this.itemLimit; i++) {
                    this.dropZoneItems.push({...placeholderDropZoneItem});
                }
            }
        }
    }

    drop(event: CdkDragDrop<DropZoneItemModel[], any>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
}
