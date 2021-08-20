import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {WeatherData} from "./weather-data";
import {WeatherLocation} from "./weather-location";
import packageInfo from '../../../../../package.json'; // needed to gather application name and version

@Injectable({
  providedIn: 'root'
})
export class WeatherService implements OnDestroy {

  private weatherLocation: WeatherLocation = 'thun';
  private subject = new BehaviorSubject<WeatherData>({
    airTemperature: 0,
    location: "",
    timestamp: 0,
    waterFlow: 0,
    waterTemperature: 0,
    weatherSymbol: 0
  });
  private appVersion: string = packageInfo.version;
  private appName: string = packageInfo.name;
  private readonly pollerIntervalNumber: number;

  constructor() {
    this.loadWeatherData();
    this.pollerIntervalNumber = setInterval(()=>this.loadWeatherData(), 300000); // 5min interval is best practise
  }

  ngOnDestroy(): void {
    clearInterval(this.pollerIntervalNumber);
  }

  getWeatherObservable(): Observable<WeatherData> {

    // ToDo Give location parameter to load different weather data for subscribers

    // ToDo Remove locatio parameter when unsubscribing

    return this.subject.asObservable()
  }

  setLocation(newLocation: WeatherLocation) {
    this.weatherLocation = newLocation;
  }

  getLocation(): WeatherLocation {
    return this.weatherLocation;
  }

  private loadWeatherData() {

    // see https://aareguru.existenz.ch/openapi/ and https://aareguru.existenz.ch/#parameter for details

    let weatherDataUrl = "https://aareguru.existenz.ch/v2018/current"
    weatherDataUrl += "?city=" + this.weatherLocation.toString();
    weatherDataUrl += "&app=" + this.appName;
    weatherDataUrl += "&version=" + this.appVersion;
    weatherDataUrl += "&values=";

    weatherDataUrl += "aare.location,";
    weatherDataUrl += "aare.timestamp,";
    weatherDataUrl += "aare.temperature,";
    weatherDataUrl += "aare.flow,";
    weatherDataUrl += "weather.current.tt,";
    weatherDataUrl += "weather.today.n.symt";

    console.log(`Refreshing weather data`);

    fetch(weatherDataUrl)
        .then(response => response.text())
        .then(text => this.extractWeather(text))
        .catch(error => console.log('ERROR:', error));
  }

  private extractWeather(text: string) {
    const data = text.split('\n');

    if (data.length >= 6) {
      const weatherData: WeatherData = {
        location: data[0].toLowerCase(),
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
