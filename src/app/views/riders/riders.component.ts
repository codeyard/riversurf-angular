import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {exampleRiderFemale, exampleRiderKid, exampleRiderMale, Rider} from "../../models/rider.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

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
export class RidersComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['avatar', 'name', 'nickName', 'division', 'action'];
    dataSource = new MatTableDataSource(RIDERS_DATA);
    favoriteRiders: Rider[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    division: string = '';

    constructor() {
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    toggleDivision(): void {
        this.dataSource.filter = this.division;
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
