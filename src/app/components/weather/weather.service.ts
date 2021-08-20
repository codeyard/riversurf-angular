import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {WeatherData} from "./weather-data";
import {WeatherLocation} from "./weather-location";
import {WeatherSubject} from "./weather-subject";

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements OnDestroy{

  private weatherSubjects : WeatherSubject[] = [];

  constructor() {  }

  getWeatherObservable(weatherLocation : WeatherLocation): Observable<WeatherData> {
    let subject = this.weatherSubjects.find(subject=>subject.weatherLocation === weatherLocation);
    if(!subject){
      subject = new WeatherSubject(weatherLocation);
      this.weatherSubjects.push(subject);
    }
    return subject.getWeatherObservable();
  }

  ngOnDestroy(): void {
    this.weatherSubjects.forEach(subject => subject.stop());
  }
}
