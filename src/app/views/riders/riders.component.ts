import {AfterViewInit, Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {exampleRiderFemale, exampleRiderKid, exampleRiderMale, Rider} from "../../models/rider.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";

const RIDERS_DATA: Rider[] = [
    exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale,
    exampleRiderFemale, exampleRiderFemale, exampleRiderFemale, exampleRiderFemale, exampleRiderFemale,
    exampleRiderKid, exampleRiderKid, exampleRiderKid, exampleRiderKid, exampleRiderKid, exampleRiderKid,
    exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale,
    exampleRiderFemale, exampleRiderFemale, exampleRiderFemale, exampleRiderFemale, exampleRiderFemale,
    exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale,
    exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale,
    exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale,
    exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale,
    exampleRiderMale, exampleRiderMale, exampleRiderMale, exampleRiderMale,
    exampleRiderFemale, exampleRiderFemale, exampleRiderFemale, exampleRiderFemale, exampleRiderFemale,
    exampleRiderFemale, exampleRiderFemale, exampleRiderFemale,
    exampleRiderKid, exampleRiderKid, exampleRiderKid, exampleRiderKid, exampleRiderKid, exampleRiderKid
];

@Component({
    selector: 'surf-riders',
    templateUrl: './riders.component.html',
    styleUrls: ['./riders.component.scss']
})
export class RidersComponent implements OnInit, AfterViewInit, OnChanges {
    displayedColumns: string[] = ['avatar', 'name', 'nickName', 'division', 'action'];
    dataSource = new MatTableDataSource(RIDERS_DATA);
    favoriteRiders: Rider[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    division: string = '';

    filter: string = '';
    pageEvent?: PageEvent; // Attention: don't remove, even if IntelliJ suggests it!
    pageIndex?: number;
    pageSize!: number;
    length!: number;

    constructor(private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['filter']) {
                this.filter = params['filter'];
            }
            if (params['division']) {
                this.division = params['division'];
                this.dataSource.data = RIDERS_DATA.filter(rider => rider.division === this.division);
            }
            if (params['page']) {
                this.pageIndex = params['page'];
            }
            if (params['pageSize']) {
                this.pageSize = params['pageSize'];
            }
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.filter && this.filter.length) {
            this.dataSource.filter = this.filter;
        }
    }

    ngOnChanges() {
        if (this.dataSource) {
            this.length = this.dataSource.data.length;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;

            if (this.filter && this.filter.length) {
                this.dataSource.filter = this.filter;
            }
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;

        if (filterValue.trim().length) {
            this.dataSource.filter = filterValue.trim().toLowerCase();

            this.router.navigate([], {
                queryParams: {
                    filter: filterValue,
                    page: null
                },
                queryParamsHandling: 'merge',
            }).then();
        } else {
            this.clearFilter();
        }
    }

    clearFilter() {
        this.filter = '';
        this.dataSource.filter = '';

        this.router.navigate([], {
            queryParams: {
                filter: null
            },
            queryParamsHandling: 'merge',
        }).then();
    }

    handlePage(event: any) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        this.router.navigate([], {
            queryParams: {
                page: this.pageIndex,
                pageSize: this.pageSize
            },
            queryParamsHandling: 'merge',
        }).then();
    }

    toggleDivision(): void {
        this.dataSource.data = RIDERS_DATA.filter(rider => rider.division === this.division);
        console.log(this.dataSource.data)

        this.router.navigate([], {
            queryParams: {
                division: this.division,
                page: null
            },
            queryParamsHandling: 'merge',
        }).then();
    }

    toggleFavorites(rider: Rider) {
        const indexOfRider = this.favoriteRiders.findIndex(elementRider => elementRider.id === rider.id);

        indexOfRider > -1
            ? this.favoriteRiders.splice(indexOfRider, 1)
            : this.favoriteRiders.push(rider);
    }

    isFavoriteRider(riderId: string): boolean {
        return this.favoriteRiders.findIndex(elementRider => elementRider.id === riderId) > -1;
    }

}
