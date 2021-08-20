import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {WeatherData} from "./weather-data";
import {WeatherLocation} from "./weather-location";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private location : WeatherLocation = 'thun';

  private subject = new Subject<WeatherData>()


  constructor() {
    console.log(`Created service`);
    setTimeout(()=>{
      const loadedData : WeatherData = {
        airTemperature: 99, location: "thun", timestamp: 0, waterFlow: 999, waterTemperature: 1000, weatherSymbol: 1
      }
      console.log(`Sending data`);
      this.sendWeather(loadedData);
      console.log(`Data sent`);
    }, 3000);
  }


  setLocation(newLocation : WeatherLocation){
    this.location = newLocation;
  }

  getLocation() : WeatherLocation{
    return this.location;
  }

  private sendWeather(data : WeatherData){
    this.subject.next(data);
  }

  getWeatherObservable() : Observable<WeatherData> {
    return this.subject.asObservable()
  }

}
