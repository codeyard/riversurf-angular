import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {WeatherLocation} from "./weather-location";
import {DefaultWeatherData, WeatherData} from "./weather-data";
import {WeatherService} from "./weather.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'rs-weather',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy, OnChanges {

    /**
     * Weather data used for view
     */
    weather: WeatherData;

    /**
     * Loading flag to show a spinner when loading data
     */
    loading: boolean;

    /**
     * Weather location as input
     */
    @Input() weatherLocation: WeatherLocation;

    private weatherServiceSubscription: Subscription = new Subscription();

    constructor(private weatherService: WeatherService) {
        this.weatherLocation = 'thun';
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
        if (changes.weatherLocation.currentValue != changes.weatherLocation.previousValue && changes.weatherLocation.previousValue != undefined) {
            this.loading = true;
            this.stopSubscription();
            this.startSubscription();
        }
    }

    private refreshWeatherData(data: WeatherData) {
        this.weather.location = data.locationText;
        this.weather.weatherSymbol = data.weatherSymbol;
        this.weather.airTemperature = data.airTemperature;
        this.weather.waterTemperature = data.waterTemperature;
        this.weather.waterFlow = data.waterFlow;
        if (this.loading) {
            this.loading = false;
        }
    }

    private stopSubscription() {
        this.weatherServiceSubscription.unsubscribe();
    }

    private startSubscription() {
        this.weatherServiceSubscription =
            this.weatherService.getWeatherObservable(this.weatherLocation)
                .subscribe((data) => this.refreshWeatherData(data));
    }
}
