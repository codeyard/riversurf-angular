import {Component, Input, OnInit} from '@angular/core';
import {WeatherLocation} from "./weather-location";
import {WeatherData} from "./weather-data";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  weather : WeatherData;
  loading : boolean;

  @Input() location : WeatherLocation = 'thun';

  constructor() {
    this.weather = {
      airTemperature: 21.3,
      waterFlow: 143,
      waterTemperature: 16.6,
      weatherSymbol: 2,
      timestamp: 0
    }
    this.loading = true;
  }

  ngOnInit(): void {
    setTimeout(()=>this.loading = false, 2000);
  }

}
