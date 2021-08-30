import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren, Directive, ElementRef, HostListener, Input, OnChanges, OnDestroy,
    OnInit,
    QueryList, Renderer2, SimpleChanges, TemplateRef, ViewChild,
    ViewChildren
} from '@angular/core';
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
export class CarouselComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit, AfterViewInit {

    TIMING = '250ms ease-in';

    @ViewChild('carouselList') private carouselList!: ElementRef<HTMLElement>;
    @ViewChild('craouselListItem') private carouselListItem!: ElementRef<HTMLElement>;

    @ViewChildren('craouselListItem') private carouselListItems!: QueryList<ElementRef>;

    @ContentChildren(CarrousellItemDirective) elements!: QueryList<any>;

    @Input()
    startIndex?: number;


    public ready = false;

    private currentIndex = 0;

    private currentOffset: number = 0;
    private offsetwidth = 0;
    private carouselWidth = 0;
    private itemWidth = 0;
    private itemOffsetSpacing = 0;

    private resizeObserver = new ResizeObserver(() => this.onResize());

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private animationBuilder: AnimationBuilder
    ) {
    }

    ngOnInit(): void {
        this.resizeObserver.observe(this.elementRef.nativeElement);
    }

    ngOnDestroy() {
        this.resizeObserver.disconnect()
    }

    ngAfterContentInit(): void {
        // content- Childs are ready here
    }

    ngAfterViewInit() {
        // view-Childs are ready here
        this.ready = true;
        this.initCarousel();
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log("CHANGES!!!");
        if(this.ready && changes.startIndex.currentValue !== changes.startIndex.previousValue) {
            this.goToIndex(changes.startIndex.currentValue);
        }
    }

    onResize() {
        this.calculateSizes();
    }

    private initCarousel() {
        this.calculateSizes();
        this.goToIndex(this.startIndex ? this.startIndex : 0);
        this.playAnimation();
    }

    private calculateSizes() {
        this.carouselWidth = this.carouselList.nativeElement.clientWidth;
        this.itemWidth = this.carouselListItem.nativeElement.clientWidth;
        this.itemOffsetSpacing = (this.carouselWidth-this.itemWidth)/2;
        this.offsetwidth = this.itemWidth + this.itemOffsetSpacing;
    }

    public onPan(event: any, element: HTMLElement): void {
        // https://github.com/angular/angular/issues/10541#issuecomment-346539242
        // if y velocity is greater, it's a panup/pandown, so ignore.
        if (Math.abs(event.velocityY) > Math.abs(event.velocityX)) {
            return;
        }
        let deltaX = event.deltaX + this.itemOffsetSpacing;
        this.renderer.setStyle(
            this.carouselList.nativeElement,
            'transform',
            `translateX(${this.currentOffset + deltaX}px)`
        );
    }

    onPanEnd(event: any, element: HTMLLIElement) {
        // this should not be nececery, but on panup and pandown deltaX is always >200 ???
        if(event.additionalEvent === "panup" || event.additionalEvent === "pandown") {
            return;
        }
        let deltaX = event.deltaX;

        let sign = Math.sign(deltaX)
        if (Math.abs(deltaX) >= this.carouselListItem.nativeElement.clientWidth / 4) {
            deltaX = sign * this.carouselListItem.nativeElement.clientWidth;
        }
        if (Math.abs(deltaX) <= this.carouselListItem.nativeElement.clientWidth / 4) {
            deltaX = 0;
        }
        if (0 >= this.currentOffset + deltaX && this.currentOffset + deltaX > -this.calcTotalWidth()) {
            this.currentOffset += deltaX;
        }
        this.playAnimation();
    }

    private goToIndex(index: number) {
        this.currentOffset = -index * this.itemWidth;
        this.playAnimation();
    }

    private getTranslation(offset: number): string {
        return `translateX(${offset}px)`;
    }

    private playAnimation(): void {
        const translation = this.getTranslation(this.currentOffset+this.itemOffsetSpacing);
        const factory = this.animationBuilder.build(
            animate(this.TIMING, style({transform: translation}))
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
