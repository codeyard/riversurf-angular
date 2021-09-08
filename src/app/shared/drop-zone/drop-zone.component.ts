import {
    AfterContentInit,
    Component,
    ContentChild,
    ContentChildren,
    Directive, ElementRef,
    Input, OnChanges,
    OnInit,
    QueryList, SimpleChanges, TemplateRef
} from '@angular/core';
import {DropZoneItemComponent} from "./drop-zone-item/drop-zone-item.component";

@Directive({selector: 'rs-drop-placeholder'})
export class DropPlaceholderDirective {
    constructor(public templateRef: TemplateRef<any>, public elementRef: ElementRef){}
}

@Directive({selector: 'rs-drop-item'})
export class DropItemDirective {
    constructor(public templateRef: TemplateRef<any>, public elementRef: ElementRef){}
}


@Component({
    selector: 'rs-drop-zone',
    templateUrl: './drop-zone.component.html',
    styleUrls: ['./drop-zone.component.scss']
})
export class DropZoneComponent implements OnInit, AfterContentInit, OnChanges {

    @Input() itemLimit : number = 4;

    @ContentChild(DropPlaceholderDirective) placeholder : any;
    @ContentChildren(DropItemDirective) items : QueryList<any> | undefined;

    dropSlots : any[] = new Array(this.itemLimit);

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterContentInit(): void {
        console.log(`placeholder`, this.placeholder);
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(`Changes!`, changes);
        if (changes.itemLimit.currentValue != changes.itemLimit.previousValue && changes.itemLimit.currentValue != undefined && this.dropSlots.length != this.itemLimit) {

            // reduce
            if(this.dropSlots.length > this.itemLimit){

                // remove all placeholders (will be added at extending)
                //this.slots = this.slots.filter(x=>x.isPlaceholder());

                // over limit even after removing the placeholders?
                if(this.dropSlots.length > this.itemLimit){
                    this.dropSlots.length = this.itemLimit;
                }
            }

            // extending
            if(this.dropSlots.length < this.itemLimit){
                for(let i = this.dropSlots.length; i < this.itemLimit; i++){
                    this.dropSlots.push(0);
                }
            }
        }
    }

}
