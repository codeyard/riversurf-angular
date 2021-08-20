import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {WeatherData} from "./weather-data";
import {WeatherLocation} from "./weather-location";
import packageInfo from '../../../../../package.json'; // needed to gather application name and version

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements OnInit, OnDestroy {

  private weatherLocations: WeatherLocation[] = [];
  private subject = new BehaviorSubject<WeatherData>({
    airTemperature: 0,
    location: "",
    locationText: "",
    timestamp: 0,
    waterFlow: 0,
    waterTemperature: 0,
    weatherSymbol: 0
  });
  private appVersion: string = packageInfo.version;
  private appName: string = packageInfo.name;
  private pollerIntervalNumber: number = -1;

  constructor() {  }

  ngOnInit(): void {
    this.startService();
  }

  ngOnDestroy(): void {
    this.stopService();
  }

  getWeatherObservable(weatherLocation: WeatherLocation): Observable<WeatherData> {
    if (!this.weatherLocations.includes(weatherLocation)) {
      this.weatherLocations.push(weatherLocation);
      this.stopService();
      this.startService();
    }
    return this.subject.asObservable()
  }

  private startService() {
    this.loadWeatherData();
    this.pollerIntervalNumber = setInterval(() => this.loadWeatherData(), 300000); // 5min interval is best practise
  }

  private stopService() {
    clearInterval(this.pollerIntervalNumber);
  }

  private loadWeatherData() {
    if (this.weatherLocations.length > 0) {
      this.weatherLocations.forEach(weatherLocation => {
        // see https://aareguru.existenz.ch/openapi/ and https://aareguru.existenz.ch/#parameter for details
        let weatherDataUrl = "https://aareguru.existenz.ch/v2018/current"
        weatherDataUrl += "?city=" + weatherLocation.toString();
        weatherDataUrl += "&app=" + this.appName;
        weatherDataUrl += "&version=" + this.appVersion;
        weatherDataUrl += "&values=";
        weatherDataUrl += "aare.location,";
        weatherDataUrl += "aare.timestamp,";
        weatherDataUrl += "aare.temperature,";
        weatherDataUrl += "aare.flow,";
        weatherDataUrl += "weather.current.tt,";
        weatherDataUrl += "weather.today.n.symt";

        fetch(weatherDataUrl)
            .then(response => response.text())
            .then(text => this.extractWeatherForLocation(text, weatherLocation))
            .catch(error => console.log(`ERROR loading data for ${weatherLocation.toString()}`, error));
      });
    }
  }

  private extractWeatherForLocation(text: string, weatherLocation: WeatherLocation) {
    const data = text.split('\n');
    if (data.length >= 6) {
      const weatherData: WeatherData = {
        location: weatherLocation.toString(),
        locationText: data[0],
        timestamp: parseInt(data[1]),
        waterTemperature: parseFloat(data[2]),
        waterFlow: parseFloat(data[3]),
        airTemperature: parseFloat(data[4]),
        weatherSymbol: parseInt(data[5])
      }
      this.subject.next(weatherData);
    }
  }
}
