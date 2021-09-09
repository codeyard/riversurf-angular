import {
    AfterContentInit,
    Component,
    ContentChildren, ElementRef,
    Input, OnChanges,
    OnInit,
    QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren
} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {DropZoneItemComponent} from "./drop-zone-item/drop-zone-item.component";

@Component({
    selector: 'rs-drop-zone',
    templateUrl: './drop-zone.component.html',
    styleUrls: ['./drop-zone.component.scss']
})
export class DropZoneComponent implements OnInit, OnChanges, AfterContentInit {

    @Input() itemLimit: number = 4;

    dropSlots: number[] = new Array(this.itemLimit);

    @ViewChild('placeholder') placeholderItem !: ElementRef;

    constructor() {
        for(let i = 0; i < this.itemLimit; i++){
            this.dropSlots[i] = i;
        }
    }

    ngAfterContentInit(): void {
        console.log(`placeholder`, this.placeholderItem);
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(`Changes!`, changes);
        if (changes.itemLimit.currentValue != changes.itemLimit.previousValue && changes.itemLimit.currentValue != undefined && this.dropSlots.length != this.itemLimit) {

            // reduce
            if (this.dropSlots.length > this.itemLimit) {

                // remove all placeholders (will be added at extending)
                //this.slots = this.slots.filter(x=>x.isPlaceholder());

                // over limit even after removing the placeholders?
                if (this.dropSlots.length > this.itemLimit) {
                    this.dropSlots.length = this.itemLimit;
                }
            }

            // extending
            if (this.dropSlots.length < this.itemLimit) {
                for (let i = this.dropSlots.length; i < this.itemLimit; i++) {
                    this.dropSlots.push(i);
                }
            }
        }
    }

    drop(event: CdkDragDrop<number[], any>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
}
