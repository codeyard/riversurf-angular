import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
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

  private weatherServiceSubscription : Subscription = new Subscription();

  @Input() weatherLocation !: WeatherLocation;

  constructor(private weatherService : WeatherService) {
    this.weather = {
      airTemperature: 0, location: "", locationText: "", timestamp: 0, waterFlow: 0, waterTemperature: 0, weatherSymbol: 0
    }
    this.loading = true;
  }

  private refreshWeatherData(data: WeatherData){
    if(data.location === this.weatherLocation){
      this.weather.location = data.locationText;
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
    this.weatherServiceSubscription.add(this.weatherService.getWeatherObservable(this.weatherLocation).subscribe((data)=>this.refreshWeatherData(data)));
  }

  ngOnDestroy(): void {
    this.weatherServiceSubscription.unsubscribe();
  }
}
