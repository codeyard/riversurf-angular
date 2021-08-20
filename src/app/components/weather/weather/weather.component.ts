import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {WeatherLocation} from "./weather-location";
import {WeatherData} from "./weather-data";
import {WeatherService} from "./weather.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy {

  weather : WeatherData;
  loading : boolean;

  private weatherServiceSubscription : Subscription;

  @Input() weatherLocation : WeatherLocation = 'thun';

  constructor(private weatherService : WeatherService) {
    this.weather = {
      location: this.weatherLocation,
      airTemperature: 21.3,
      waterFlow: 143,
      waterTemperature: 16.6,
      weatherSymbol: 2,
      timestamp: 0
    }
    this.loading = true;
    this.weatherServiceSubscription = this.weatherService.getWeatherObservable().subscribe((data)=>this.refreshWeatherData(data));
  }

  private refreshWeatherData(data: WeatherData){
    console.log(`Received data`, data);
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

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.weatherServiceSubscription.unsubscribe();
  }

}
