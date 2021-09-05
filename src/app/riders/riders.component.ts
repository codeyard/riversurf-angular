import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Rider} from "../core/models/rider.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort, SortDirection} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {RidersService} from "../core/services/riders.service";
import {Subscription} from "rxjs";
import {filter} from "rxjs/operators";
import {SnackbarService} from "../core/services/snackbar.service";

@Component({
    selector: 'rs-riders',
    templateUrl: './riders.component.html',
    styleUrls: ['./riders.component.scss']
})
export class RidersComponent implements OnInit, AfterViewInit, OnDestroy {
    displayedColumns: string[] = ['avatar', 'name', 'nickName', 'division', 'action'];
    dataSource: MatTableDataSource<Rider> = new MatTableDataSource<Rider>();
    ridersSubscription?: Subscription;
    ridersData: Rider[] = [];
    routeSubscription?: Subscription;
    favoriteRiders: Rider[] = [];
    isLoading = true;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    division: string = '';

    filter: string = '';
    pageIndex?: number;
    pageSize!: number;
    length!: number;
    sortBy = 'name';
    sortDir: SortDirection = 'asc';

    maleCount: number = 0;
    femaleCount: number = 0;
    kidCount: number = 0;

    constructor(private ridersService: RidersService,
                private router: Router,
                private route: ActivatedRoute,
                private snackBarService: SnackbarService) {
    }

    ngOnInit(): void {
        this.routeSubscription = this.route.queryParams.subscribe(params => {
            if (params['filter']) {
                this.filter = params['filter'];
            }
            if (params['division']) {
                this.division = params['division'];
            }
            if (params['page']) {
                this.pageIndex = params['page'];
            }
            if (params['pageSize']) {
                this.pageSize = params['pageSize'];
            }
            if (params['sortBy']) {
                this.sortBy = params['sortBy'];
            }
            if (params['sortDir']) {
                this.sortDir = params['sortDir'];
            }
            this.initTableData();
        });

        this.ridersSubscription = this.ridersService.getRiders()
            .pipe(
                filter(riders => riders.length > 0)
            )
            .subscribe(
                (riders: Rider[]) => {
                    this.isLoading = false;
                    this.ridersData = riders;
                    this.initTableData();
                    this.length = this.dataSource.data.length;
                    this.updateTable();

                },
                error => {
                    this.isLoading = false;
                    this.snackBarService.send("Unable to load Riders", "error");
                    console.log('ERROR loading riders data :-(', error)
                }
            );
    }

    ngAfterViewInit() {
        this.updateTable();
    }

    initTableData() {
        this.division
            ? this.dataSource.data = this.ridersData.filter(rider => rider.division === this.division)
            : this.dataSource.data = this.ridersData
        ;
        this.maleCount = this.ridersData.filter(rider => rider.division === 'male').length;
        this.femaleCount = this.ridersData.filter(rider => rider.division === 'female').length;
        this.kidCount = this.ridersData.filter(rider => rider.division === 'kid').length;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;

        if (filterValue.trim().length) {
            this.dataSource.filter = filterValue.trim().toLowerCase();

            this.router.navigate([], {
                queryParams: {filter: filterValue},
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
            queryParams: {filter: null},
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

    toggleDivision(event: any, group: any): void {
        if (this.division === event.value) {
            group.value = '';
            this.division = '';
            this.dataSource.data = this.ridersData;

            this.router.navigate([], {
                queryParams: {division: null},
                queryParamsHandling: 'merge',
            }).then();
        } else {
            this.division = event.value;
            this.dataSource.data = this.ridersData.filter(rider => rider.division === this.division);

            this.router.navigate([], {
                queryParams: {division: this.division},
                queryParamsHandling: 'merge',
            }).then();
        }
    }

    sortTable(sort: Sort) {
        this.sortBy = sort.active ?? null;
        this.sortDir = sort.direction ?? null;

        this.router.navigate([], {
            queryParams: {
                sortBy: this.sortBy,
                sortDir: this.sortDir
            },
            queryParamsHandling: 'merge',
        }).then();
    }

    // TODO: add/read favorite riders to/from storage
    toggleFavorites(rider: Rider) {
        const indexOfRider = this.favoriteRiders.findIndex(elementRider => elementRider.id === rider.id);

        indexOfRider > -1
            ? this.favoriteRiders.splice(indexOfRider, 1)
            : this.favoriteRiders.push(rider);
    }

    isFavoriteRider(riderId: string): boolean {
        return this.favoriteRiders.findIndex(elementRider => elementRider.id === riderId) > -1;
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
        this.ridersSubscription?.unsubscribe();
    }

    private updateTable(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.filter && this.filter.length) {
            this.dataSource.filter = this.filter;
        }
    }

}
