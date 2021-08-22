import {BehaviorSubject, Observable} from "rxjs";
import {DefaultWeatherData, WeatherData} from "./weather-data";
import {WeatherLocation} from "./weather-location";
import packageInfo from '../../../../package.json'; // needed to gather application name and version
import {HttpClient} from "@angular/common/http";

export class WeatherSubject {

    private subject: BehaviorSubject<WeatherData> = new BehaviorSubject<WeatherData>({...DefaultWeatherData});
    private pollerNumber: number;
    private appVersion: string = packageInfo.version;
    private appName: string = packageInfo.name;

    readonly weatherLocation: WeatherLocation;

    constructor(private httpClient: HttpClient, weatherLocation: WeatherLocation) {
        this.weatherLocation = weatherLocation;
        this.loadWeatherData();
        this.pollerNumber = setInterval(() => this.loadWeatherData(), 30000); // 5min interval
    }

    getWeatherObservable(): Observable<WeatherData> {
        return this.subject.asObservable()
    }

    stop() {
        clearInterval(this.pollerNumber);
    }

    private loadWeatherData() {

        // see https://aareguru.existenz.ch/openapi/ and https://aareguru.existenz.ch/#parameter for details
        let weatherDataUrl = "https://aareguru.existenz.ch/v2018/current"
            + "?city=" + this.weatherLocation.toString()
            + "&app=" + this.appName
            + "&version=" + this.appVersion
            + "&values="
            + "aare.location,"
            + "aare.timestamp,"
            + "aare.temperature,"
            + "aare.flow,"
            + "weather.current.tt,";

        // ToDo Handle timezones for forecast, maybe depending on event date (and location)

        // depending of the time of the day we ask for the different weather forecast symbol
        const hourOfDay = new Date().getUTCHours() + 1; // utc+1
        if (hourOfDay >= 18) {
            weatherDataUrl += "weather.today.a.symt"; // .a = abend
        } else if (hourOfDay >= 12) {
            weatherDataUrl += "weather.today.n.symt"; // .n = nachmittag
        } else {
            weatherDataUrl += "weather.today.v.symt"; // .v = vormittag
        }

        // fetch(weatherDataUrl)
        //     .then(response => response.text())
        //     .then(text => this.extractWeather(text))
        //     .catch(error => console.log(`ERROR loading data for ${this.weatherLocation.toString()}`, error));

        this.httpClient.request('GET', weatherDataUrl, {responseType: 'text'}).subscribe(
            text => this.extractWeather(text),
            error => console.log(`ERROR loading data for ${this.weatherLocation.toString()}`, error)
        );

    }

    private extractWeather(text: string) {
        const data = text.split('\n');
        if (data.length >= 6) {
            const weatherData: WeatherData = {
                location: this.weatherLocation.toString(),
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