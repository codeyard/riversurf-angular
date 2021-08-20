import {BehaviorSubject, Observable} from "rxjs";
import {WeatherData} from "./weather-data";
import {WeatherLocation} from "./weather-location";
import packageInfo from '../../../../package.json'; // needed to gather application name and version

export class WeatherSubject{

    private subject :   BehaviorSubject<WeatherData> = new BehaviorSubject<WeatherData>({
        airTemperature: 0,
        location: "",
        locationText: "",
        timestamp: 0,
        waterFlow: 0,
        waterTemperature: 0,
        weatherSymbol: 0
    });
    private readonly pollerNumber : number;
    private appVersion: string = packageInfo.version;
    private appName: string = packageInfo.name;

    weatherLocation : WeatherLocation = 'thun';

    constructor(weatherLocation : WeatherLocation) {
        this.weatherLocation = weatherLocation;
        this.loadWeatherData();
        this.pollerNumber = setInterval(()=>this.loadWeatherData(), 300000); // 5min interval
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
        if(hourOfDay >= 18){
            weatherDataUrl += "weather.today.a.symt"; // .a = abend
        } else if(hourOfDay >= 12) {
            weatherDataUrl += "weather.today.n.symt"; // .n = nachmittag
        } else {
            weatherDataUrl += "weather.today.v.symt"; // .v = vormittag
        }

        fetch(weatherDataUrl)
            .then(response => response.text())
            .then(text => this.extractWeather(text))
            .catch(error => console.log(`ERROR loading data for ${this.weatherLocation.toString()}`, error));
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