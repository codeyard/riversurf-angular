import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from "rxjs";
import {WeatherData} from "./weather-data";
import {WeatherLocation} from "./weather-location";
import {WeatherSubject} from "./weather-subject";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements OnDestroy{

  private weatherSubjects : WeatherSubject[] = [];

  constructor(private httpClient: HttpClient) {  }

  getWeatherObservable(weatherLocation : WeatherLocation): Observable<WeatherData> {
    let subject = this.weatherSubjects.find(subject=>subject.weatherLocation === weatherLocation);
    if(!subject){
      subject = new WeatherSubject(this.httpClient, weatherLocation);
      this.weatherSubjects.push(subject);
    }
    return subject.getWeatherObservable();
  }

  ngOnDestroy(): void {
    this.weatherSubjects.forEach(subject => subject.stop());
  }
}
