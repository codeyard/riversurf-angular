import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren, Directive, ElementRef,
    OnInit,
    QueryList, Renderer2, TemplateRef, ViewChild,
    ViewChildren
} from '@angular/core';
import {ListKeyManager, ListKeyManagerOption} from "@angular/cdk/a11y";
import {animate, AnimationBuilder, style} from "@angular/animations";

@Directive({selector: '[carousel-item]'})
export class CarrousellItemDirective {
    constructor(
        public el: TemplateRef<any>,
        public elementRef: ElementRef
    ) {
    }
}


@Component({
    selector: 'surf-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterContentInit {

    @ViewChild('carouselList') private carouselList!: ElementRef<HTMLElement>;
    @ViewChild('craouselListItem') private carouselListItem!: ElementRef<HTMLElement>;
    @ViewChildren('craouselListItem') private carouselListItems!: QueryList<ElementRef>;

    @ContentChildren(CarrousellItemDirective) elements!: QueryList<any>;

    public ready = false;
    currentOffset: number = 0;

    timings = '250ms ease-in';

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private animationBuilder: AnimationBuilder
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterContentInit(): void {
        this.ready = true;
        // console.log(this.elements.first.nativeElement.clientWidth);
    }

    public onPan(event: any, element: CarrousellItemDirective): void {
        // https://github.com/angular/angular/issues/10541#issuecomment-346539242
        // if y velocity is greater, it's a panup/pandown, so ignore.
        if (Math.abs(event.velocityY) > Math.abs(event.velocityX)) {
            return;
        }
        let deltaX = event.deltaX;
        let sign = Math.sign(deltaX)
        //this.renderer.setStyle(slideElem, 'cursor', 'grabbing');
        this.renderer.setStyle(
            this.carouselList.nativeElement,
            'transform',
            `translateX(${this.currentOffset + deltaX}px)`
        );
    }

    onPanEnd(event: any, element: CarrousellItemDirective) {
        let deltaX = event.deltaX;

        let sign = Math.sign(deltaX)
        if (Math.abs(deltaX) >= this.carouselListItem.nativeElement.clientWidth / 3) {
            deltaX = sign * this.carouselListItem.nativeElement.clientWidth;
        }
        if (Math.abs(deltaX) <= this.carouselListItem.nativeElement.clientWidth / 3) {
            deltaX = 0;
        }
        console.log(this.calcTotalWidth())
        if (0 >= this.currentOffset + deltaX && this.currentOffset + deltaX > -this.calcTotalWidth()) {
            this.currentOffset += deltaX;
        }
        this.playAnimation();
    }

    private getTranslation(offset: number): string {
        return `translateX(${offset}px)`;
    }

    private playAnimation(): void {
        const translation = this.getTranslation(this.currentOffset);
        const factory = this.animationBuilder.build(
            animate(this.timings, style({transform: translation}))
        );
        const animation = factory.create(this.carouselList.nativeElement);

        animation.onStart(() => {
            // this.playing = true;
        });
        animation.onDone(() => {
            this.renderer.setStyle(
                this.carouselList.nativeElement,
                'transform',
                translation
            );
            animation.destroy();
        });
        animation.play();
    }

    private calcTotalWidth() {
        return this.carouselListItems.reduce((acc, item) => acc + item.nativeElement.clientWidth, 0);
    }
}
