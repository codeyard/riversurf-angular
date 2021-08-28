import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren, Directive, ElementRef, HostListener, Input,
    OnInit,
    QueryList, Renderer2, TemplateRef, ViewChild,
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
export class CarouselComponent implements OnInit, AfterContentInit, AfterViewInit {

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

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private animationBuilder: AnimationBuilder
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterContentInit(): void {
        // console.log(this.elements.first.nativeElement.clientWidth);
    }

    ngAfterViewInit() {
        this.ready = true;
        this.initCarousel();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.initCarousel();
    }

    private initCarousel() {
        this.carouselWidth = this.carouselList.nativeElement.clientWidth;
        this.itemWidth = this.carouselListItem.nativeElement.clientWidth;
        this.itemOffsetSpacing = (this.carouselWidth-this.itemWidth)/2;
        this.offsetwidth = this.itemWidth + this.itemOffsetSpacing;
        this.goToIndex(this.startIndex ? this.startIndex : 0);
        this.playAnimation();
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
        let deltaX = event.deltaX;

        let sign = Math.sign(deltaX)
        if (Math.abs(deltaX) >= this.carouselListItem.nativeElement.clientWidth / 3) {
            deltaX = sign * this.carouselListItem.nativeElement.clientWidth;
        }
        if (Math.abs(deltaX) <= this.carouselListItem.nativeElement.clientWidth / 3) {
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
