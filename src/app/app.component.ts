import { Component } from '@angular/core';
import {WeatherLocation} from "./components/weather/weather/weather.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RiverSurf';
  eventLocation : WeatherLocation = 'thun';
}
