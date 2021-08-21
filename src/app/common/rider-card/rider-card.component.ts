import {Component, Input, OnInit} from '@angular/core';
import {Rider} from "../../models/rider.model";

@Component({
  selector: 'surf-rider-card',
  templateUrl: './rider-card.component.html',
  styleUrls: ['./rider-card.component.scss']
})
export class RiderCardComponent implements OnInit {
  @Input()
  rider!: Rider;

  constructor() { }

  ngOnInit(): void {
  }

}
