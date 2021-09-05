import { Component, OnInit } from '@angular/core';
import {Event, exampleEvent} from "../../core/models/event.model";

@Component({
  selector: 'rs-surf-event',
  templateUrl: './surf-event.component.html',
  styleUrls: ['./surf-event.component.scss']
})
export class SurfEventComponent implements OnInit {

    surfEvent: Event = {...exampleEvent};

  constructor() { }

  ngOnInit(): void {
  }

}
