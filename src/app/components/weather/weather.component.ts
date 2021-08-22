import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {WeatherLocation} from "./weather-location";
import {DefaultWeatherData, WeatherData} from "./weather-data";
import {WeatherService} from "./weather.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy, OnChanges {

  weather : WeatherData;
  loading : boolean;

  private weatherServiceSubscription : Subscription = new Subscription();

  @Input() weatherLocation! : WeatherLocation;

  constructor(private weatherService : WeatherService) {
    this.weather = {...DefaultWeatherData};
    this.loading = true;
  }

  ngOnInit(): void {
    this.startSubscription();
  }

  ngOnDestroy(): void {
    this.stopSubscription();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`Change detected`, changes);
    if(changes.weatherLocation.currentValue != changes.weatherLocation.previousValue && changes.weatherLocation.previousValue != undefined){
      console.log(`Changed to`, this.weatherLocation);
      this.loading = true;
      this.stopSubscription();
      this.startSubscription();
    }
  }

  private refreshWeatherData(data: WeatherData){
    if(data.location === this.weatherLocation){
      console.log(`Refreshing for`, this.weatherLocation);
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

  private stopSubscription(){
    this.weatherServiceSubscription.unsubscribe();
  }

  private startSubscription(){
      this.weatherServiceSubscription =
          this.weatherService.getWeatherObservable(this.weatherLocation)
              .subscribe((data) => this.refreshWeatherData(data));
  }
}
