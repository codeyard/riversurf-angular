import {Component, Input, OnDestroy} from '@angular/core';
import {WeatherLocation} from "./weather-location";
import {WeatherData} from "./weather-data";
import {WeatherService} from "./weather.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnDestroy {

  weather : WeatherData;
  loading : boolean;

  private weatherServiceSubscription : Subscription;

  @Input() weatherLocation : WeatherLocation = 'thun';

  constructor(private weatherService : WeatherService) {
    this.weather = {
      airTemperature: 0, location: "", timestamp: 0, waterFlow: 0, waterTemperature: 0, weatherSymbol: 0
    }
    this.loading = true;
    this.weatherServiceSubscription = this.weatherService.getWeatherObservable().subscribe((data)=>this.refreshWeatherData(data));
  }

  private refreshWeatherData(data: WeatherData){
    if(data.location === this.weatherLocation){
      this.weather.weatherSymbol = data.weatherSymbol;
      this.weather.airTemperature = data.airTemperature;
      this.weather.waterTemperature = data.waterTemperature;
      this.weather.waterFlow = data.waterFlow;
      if(this.loading){
        this.loading = false;
      }
    }
  }

  ngOnDestroy(): void {
    this.weatherServiceSubscription.unsubscribe();
  }
}
