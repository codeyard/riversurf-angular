import {Component, Input, OnInit} from '@angular/core';


export type WeatherLocation = 'brienz'|'interlaken'|'thun'|'bern'|'hagneck'|'biel'|'brugg';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {


  @Input() location : WeatherLocation = 'thun';

  constructor() { }

  ngOnInit(): void {
  }

}
