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

    @Input() index?: number;
    @Input() showControls: boolean = true;
    @Input() focusCurrent: boolean = true;
    @Input() auto: boolean = false;
    @Input() intervalTime: number = 5000;

    ready = false;
    currentIndex = 0;
    previousIndex = 0;

    /* CONST */
    private readonly TIMING = '250ms ease-in';
    private readonly MINIMAL_OPACITY = 0.4;
    private readonly PAN_THRESHOLD = 1 / 4;
    private readonly VELOCITY_THRESHOLD = 1;

    /* Content- and ViewElements */
    @ViewChild('carouselList') private carouselList!: ElementRef<HTMLElement>;
    @ViewChildren('craouselListItem') public carouselListItems!: QueryList<ElementRef>;
    @ContentChildren(CarrousellItemDirective) elements!: QueryList<any>;

    /* Calculated Values on Resize*/
    private carouselWidth = 0;
    private itemWidth = 0;
    private itemOffsetSpacing = 0;

    /* Asyncronous staff that needs to be cleaned up on Destroy */
    private resizeObserver = new ResizeObserver(() => this.onResize());
    private interval: any;

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
        this.resizeObserver.disconnect();
        clearInterval(this.interval);
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
        if (this.ready && changes.index && changes.index.currentValue !== changes.index.previousValue) {
            this.goToIndex(changes.index.currentValue);
        }
    }

    onResize() {
        this.calculateSizes();
    }

    private calculateSizes() {
        this.carouselWidth = this.carouselList.nativeElement.clientWidth;
        this.itemWidth = this.carouselListItems.first.nativeElement.clientWidth;
        this.itemOffsetSpacing = (this.carouselWidth - this.itemWidth) / 2;
    }

    private initCarousel() {
        this.calculateSizes();
        if (this.auto) {
            this.interval = setInterval(() => {
                if(this.isIndexValid(this.currentIndex+1)) {
                    this.goToNex();
                } else {
                    this.goToIndex(0);
                }
            }, this.intervalTime)
        }
        this.goToIndex(this.index ? this.index : 0);
    }

    /* When User starts to swipe (and keeps swiping) */
    onPan(event: any): void {
        // https://github.com/angular/angular/issues/10541#issuecomment-346539242
        // if y velocity is greater, it's a panup/pandown, so ignore.
        if (Math.abs(event.velocityY) > Math.abs(event.velocityX)) {
            return;
        }

        let deltaX = event.deltaX;
        let direction = Math.sign(deltaX);

        /* inputvalue: focusCurrent -> blur every element except for the focused one */
        if (this.focusCurrent) {
            this.focusOnTransition(deltaX, direction);
        }

        this.renderer.setStyle(
            this.carouselList.nativeElement,
            'transform',
            `translateX(${this.currentIndex * (-this.itemWidth) + deltaX + this.itemOffsetSpacing}px)`
        );
    }

    /* when User lifts finger after swiping */
    onPanEnd(event: any) {

        if (event.additionalEvent === "panup" || event.additionalEvent === "pandown") {
            return;
        }
        let deltaX = event.deltaX;

        let direction = Math.sign(deltaX)

        if (Math.abs(deltaX) >= this.itemWidth * this.PAN_THRESHOLD) {
            this.goToIndex(this.currentIndex - direction);
            return;
        }
        this.goToIndex(this.currentIndex);
    }

    goToNex() {
        this.goToIndex(this.currentIndex + 1);
    }

    goToPrevious() {
        this.goToIndex(this.currentIndex - 1);
    }

    private goToIndex(index: number) {
        if (!this.isIndexValid(index)) {
            this.playAnimation();
            return;
        }
        this.previousIndex = this.currentIndex;
        this.currentIndex = index;
        this.playAnimation();
    }

    /* when we move to an index we want to animate it */
    private playAnimation(): void {
        /* inputvalue: focusCurrent -> blur every element except for the focused one */
        if (this.focusCurrent) {
            this.stopTransitionFocus();
        }

        const translation = this.calcTranslation();
        const translationFactory = this.animationBuilder.build(
            animate(this.TIMING, style({transform: translation}))
        );
        const translationAnimation = translationFactory.create(this.carouselList.nativeElement);
        translationAnimation.onDone(() => {
            this.renderer.setStyle(
                this.carouselList.nativeElement,
                'transform',
                translation
            );
            translationAnimation.destroy();
        });
        translationAnimation.play();
    }

    private calcTranslation(): string {
        const offset = (this.currentIndex * (-this.itemWidth)) + this.itemOffsetSpacing;
        return `translateX(${offset}px)`;
    }

    private focusOnTransition(deltaX: number, direction: number): void {
        /* Change Opacity while sliding of the Current Element */
        const opacity = 1 - ((Math.abs(deltaX) / this.itemWidth) * (1 - this.MINIMAL_OPACITY));
        this.renderer.setStyle(this.carouselListItems.get(this.currentIndex)!.nativeElement, 'transition', 'opacity 0s');
        this.renderer.setStyle(this.carouselListItems.get(this.currentIndex)!.nativeElement, 'opacity', opacity);

        /* Change the Opacity while sliding of the next Element */
        if (this.carouselListItems.get(this.currentIndex - direction) !== undefined) {
            const opacity = this.MINIMAL_OPACITY + ((Math.abs(deltaX) / this.itemWidth) * (1 - this.MINIMAL_OPACITY));
            this.renderer.setStyle(this.carouselListItems.get(this.currentIndex - direction)!.nativeElement, 'transition', 'opacity 0s');
            this.renderer.setStyle(this.carouselListItems.get(this.currentIndex - direction)!.nativeElement, 'opacity', opacity);
        }
    }

    private stopTransitionFocus(): void {
        this.renderer.removeStyle(this.carouselListItems.get(this.currentIndex)!.nativeElement, 'opacity');
        this.renderer.removeStyle(this.carouselListItems.get(this.currentIndex)!.nativeElement, 'transition');
        this.renderer.removeStyle(this.carouselListItems.get(this.previousIndex)!.nativeElement, 'opacity');
        this.renderer.removeStyle(this.carouselListItems.get(this.previousIndex)!.nativeElement, 'transition');
        this.renderer.removeClass(this.carouselListItems.get(this.previousIndex)!.nativeElement, 'focus');
        this.renderer.addClass(this.carouselListItems.get(this.currentIndex)!.nativeElement, 'focus');
    }

    private isIndexValid(index: number): boolean {
        return (index >= 0) && (index < this.carouselListItems.length) ? true : false;
    }

}
