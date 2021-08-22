import { Component } from '@angular/core';
import {WeatherLocation} from "./components/weather/weather-location";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RiverSurf';

  myLocation : WeatherLocation = 'thun';

  onLocationChange($event: MatSelectChange) {
    this.myLocation = $event.value;
  }
}
