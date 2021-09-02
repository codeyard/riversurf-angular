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
    @ViewChildren('craouselListItem') private carouselListItems!: QueryList<ElementRef>;

    @ContentChildren(CarrousellItemDirective) elements!: QueryList<any>;

    @Input()
    index?: number;



    private readonly PAN_THRESHOLD = 1/4;
    private readonly VELOCITY_THRESHOLD = 1;

    public ready = false;

    private currentIndex = 0;

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
        if (this.ready && changes.index.currentValue !== changes.index.previousValue) {
            this.goToIndex(changes.index.currentValue);
        }
    }

    onResize() {
        this.calculateSizes();
    }

    private initCarousel() {
        this.calculateSizes();
        this.goToIndex(this.index ? this.index : 0);
    }

    private calculateSizes() {
        this.carouselWidth = this.carouselList.nativeElement.clientWidth;
        this.itemWidth = this.carouselListItems.first.nativeElement.clientWidth;
        this.itemOffsetSpacing = (this.carouselWidth - this.itemWidth) / 2;
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
            `translateX(${this.currentIndex*(-this.itemWidth) + deltaX}px)`
        );
    }

    onPanEnd(event: any, element: HTMLLIElement) {
        if (event.additionalEvent === "panup" || event.additionalEvent === "pandown") {
            return;
        }
        let deltaX = event.deltaX;

        console.log(event.velocity);

        let direction = Math.sign(deltaX)

        if (Math.abs(deltaX) >= this.itemWidth * this.PAN_THRESHOLD) {
            this.goToIndex(this.currentIndex-direction);
            return;
        }
        this.goToIndex(this.currentIndex);
    }

    private goToIndex(index: number) {
        if (!this.isIndexValid(index)) {
            this.playAnimation();
            return;
        }
        this.currentIndex = index;
        this.playAnimation();
    }

    private calcTranslation(): string {
        const offset = (this.currentIndex * (-this.itemWidth)) + this.itemOffsetSpacing;
        return `translateX(${offset}px)`;
    }

    private playAnimation(): void {
        console.log(this.currentIndex);
        const translation = this.calcTranslation();
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

    private isIndexValid(index: number): boolean {
        return (index >= 0) && (index < this.carouselListItems.length) ? true : false;
    }

}
